import { useContext, Show, Signal, createSignal, Component, createContext } from 'solid-js'
import { read, write, owrite } from 'solid-play'

export type TabsContextValue = {
  setSelectedIndex: (index: number) => void,
  isSelectedIndex: (index: number) => boolean,
  registerTabPanel: (node: HTMLElement) => number,
  registerTab: (node: HTMLButtonElement) => number
}

const TabsContext = createContext<TabsContextValue>()


export const Tabs = (props: { index?: number, children: any }) => {
  let _panels: Signal<Array<HTMLElement>> = createSignal([])
  let _tabs: Signal<Array<HTMLButtonElement>> = createSignal([])
  let _selectedIndex = createSignal(props.index || 0)

  const setSelectedIndex = (index: number) => {
    owrite(_selectedIndex, index)
  }

  const isSelectedIndex = (index: number) => {
    return index === read(_selectedIndex)
  }

  const registerTab = (node: HTMLButtonElement) => {
  return owrite(_tabs, _ => [..._, node]).length - 1
}
  const registerTabPanel = (node: HTMLElement) => {
  return owrite(_panels, _ => [..._, node]).length - 1
}

  let context = {
    isSelectedIndex,
    setSelectedIndex,
    registerTabPanel,
    registerTab
  }

  return (
    <TabsContext.Provider value={context}>
      <div class='tabs'>
        {props.children}
      </div>
    </TabsContext.Provider>
      )
}


export const Tab = (props: { children: any }) => {

  const tabsContext = useTabsContext()
  const [index, setIndex] = createSignal(-1)

  const isSelected = () => tabsContext.isSelectedIndex(index())

  const assignTabPanelRef = (el: HTMLButtonElement) => {
    setIndex(tabsContext.registerTab(el))
    }

  const onClick = () => {
    tabsContext.setSelectedIndex(index())
  }

  return (<>
    <button onClick={onClick} class='tab' ref={assignTabPanelRef}>
      {props.children}
    </button>
      </>)
}

export const TabPanel = (props: { children: any }) => {

  const tabsContext = useTabsContext()
  const [index, setIndex] = createSignal(-1)

  const isSelected = () => tabsContext.isSelectedIndex(index())
  const assignTabPanelRef = (el: HTMLDivElement) => {
    setIndex(tabsContext.registerTabPanel(el))
    }

  return (<>
    <div class='tab-panel' ref={assignTabPanelRef}>
      <Show when={isSelected()}>
        {props.children}
      </Show>
    </div>
  </>)
}

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {

    throw "Use tabs context"
  }
  return context
}
