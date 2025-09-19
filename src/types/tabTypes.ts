export type TabItem<T extends string = string> = {
  name: string
  value: T
}

export interface TabSwitcherProps<T extends string = string> {
  tabs: TabItem<T>[]
  activeTab: T
  onTabChange: (value: T) => void
}
