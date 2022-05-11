import { createContext, useContext } from 'react'
import GlobalStore from './store'

const Stores = () => ({
  GlobalStore: new GlobalStore(),
})

const createStoreContext = createContext(Stores())

const useStores = () => useContext(createStoreContext)

const useGlobalStore = () => useStores().GlobalStore

export { useGlobalStore }
