export interface DrawerItem {
  value: string;
  icon: string;
  label: string;
  openInTab: boolean;
  children: Array<DrawerItem>;
}
