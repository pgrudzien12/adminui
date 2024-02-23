import { Helper } from 'src/app/common/helper.service';
import { SchemaProperty } from 'src/app/models/schema-property.model';

export const formatDateProperty = (value: Date) => {
  return `${value.getUTCFullYear()}-${
    value.getUTCMonth() < 9
      ? `0${value.getUTCMonth() + 1}`
      : value.getUTCMonth() + 1
  }-${
    value.getUTCDate() < 9
      ? `0${value.getUTCDate() + 1}`
      : value.getUTCDate() + 1
  }`;
};

const addStringProperty = (
  property: SchemaProperty,
  definitions,
  valueName: string
) => {
  if (!property.format) return { [valueName]: valueName };

  return stringFormatActions[property.format](property, definitions, valueName);
};

const addNumberProperty = (
  property: SchemaProperty,
  definitions,
  valueName: string
) => {
  return { [valueName]: 0 };
};

const addBooleanProperty = (
  property: SchemaProperty,
  definitions,
  valueName: string
) => {
  return { [valueName]: false };
};

const addDateTimeProperty = (
  property: SchemaProperty,
  definitions,
  valueName: string
) => {
  return { [valueName]: new Date().toISOString() };
};

const addDateProperty = (
  property: SchemaProperty,
  definitions,
  valueName: string
) => {
  return { [valueName]: formatDateProperty(new Date()) };
};

const addObjectProperty = (
  property: SchemaProperty,
  definitions,
  valueName: string
) => {
  let res = {};

  if (!property.properties) return { [valueName]: res };

  Object.keys(property.properties).forEach((key) => {
    res = {
      ...res,
      ...addProperty(property.properties[key], definitions, key),
    };
  });

  return { [valueName]: res };
};

const addArrayProperty = (
  property: SchemaProperty,
  definitions,
  valueName: string
) => {
  return { [valueName]: [] };
};

const addRefProperty = (
  property: SchemaProperty,
  definitions,
  valueName: string
) => {
  const ref = Helper.getSchemaRefNameFromDocumentRef(property.$ref);
  const propertyRef = JSON.parse(JSON.stringify(definitions[ref]));
  if (property.title) propertyRef.title = property.title;

  return addProperty(propertyRef, definitions, valueName);
};

const addAllOfProperty = (property: SchemaProperty, definitions, valueName) => {
  let properties: any = {};

  property.allOf.forEach((allOfElement) => {
    if (allOfElement.type === 'object') {
      properties = { ...properties, ...allOfElement.properties };
      return;
    }

    if (allOfElement.$ref) {
      const ref =
        definitions[Helper.getSchemaRefNameFromDocumentRef(allOfElement.$ref)];
      properties = { ...properties, ...ref.properties };
    }
  });

  return addObjectProperty(properties, definitions, valueName);
};

const addOneOfProperty = (property: SchemaProperty, definitions, valueName) => {
  const selectedProperty = property.oneOf[0];
  return addProperty(selectedProperty, definitions, valueName);
};

const addNullProperty = (property: SchemaProperty, definitions, valueName) => {
  return { [valueName]: null };
};

const typeActions = {
  string: addStringProperty,
  object: addObjectProperty,
  array: addArrayProperty,
  null: addNullProperty,
  number: addNumberProperty,
  boolean: addBooleanProperty,
};

const stringFormatActions = {
  number: addNumberProperty,
  'date-time': addDateTimeProperty,
  date: addDateProperty,
};

export const addProperty = (
  property: SchemaProperty,
  definitions,
  valueName: string = null
) => {
  if (property.type)
    return typeActions[property.type](property, definitions, valueName);

  if (property.allOf) return addAllOfProperty(property, definitions, valueName);

  if (property.oneOf) return addOneOfProperty(property, definitions, valueName);

  if (property.$ref) return addRefProperty(property, definitions, valueName);
};
