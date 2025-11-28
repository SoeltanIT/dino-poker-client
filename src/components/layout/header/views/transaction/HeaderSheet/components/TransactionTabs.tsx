import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LangProps } from '@/types/langProps'

interface TransactionTabsProps {
  tabValue: string
  onTabChange: (value: string) => void
  lang: LangProps
  depositTab: React.ReactNode
  withdrawTab: React.ReactNode
  convertBalanceTab: React.ReactNode
}

export default function TransactionTabs({
  tabValue,
  onTabChange,
  lang,
  depositTab,
  withdrawTab,
  convertBalanceTab
}: TransactionTabsProps) {
  return (
    <Tabs value={tabValue} onValueChange={onTabChange} className='w-full'>
      <TabsList className='flex items-center justify-between pb-6 mt-6'>
        <div className='flex space-x-4'>
          <TabsTrigger
            value='CONVERT_BALANCE'
            className={`text-lg font-medium transition-colors uppercase ${
              tabValue === 'CONVERT_BALANCE' ? 'text-app-text-color font-semibold' : 'text-app-neutral500'
            }`}
          >
            {lang?.header?.convert}
          </TabsTrigger>
          <TabsTrigger
            value='DEPOSIT'
            className={`text-lg font-medium transition-colors uppercase ${
              tabValue === 'DEPOSIT' ? 'text-app-text-color font-semibold' : 'text-app-neutral500'
            }`}
          >
            {lang?.common?.deposit}
          </TabsTrigger>
          <TabsTrigger
            value='WITHDRAW'
            className={`text-lg font-medium transition-colors uppercase ${
              tabValue === 'WITHDRAW' ? 'text-app-text-color font-semibold' : 'text-app-neutral500'
            }`}
          >
            {lang?.common?.withdraw}
          </TabsTrigger>
        </div>
      </TabsList>

      <TabsContent value='CONVERT_BALANCE'>{convertBalanceTab}</TabsContent>
      <TabsContent value='DEPOSIT'>{depositTab}</TabsContent>
      <TabsContent value='WITHDRAW'>{withdrawTab}</TabsContent>
    </Tabs>
  )
}
