import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Primitives/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="p-4">
        <p className="text-muted-foreground text-sm">
          Make changes to your account here.
        </p>
      </TabsContent>
      <TabsContent value="password" className="p-4">
        <p className="text-muted-foreground text-sm">
          Change your password here.
        </p>
      </TabsContent>
      <TabsContent value="settings" className="p-4">
        <p className="text-muted-foreground text-sm">
          Manage your settings here.
        </p>
      </TabsContent>
    </Tabs>
  ),
}

export const TwoTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-4">
        <p className="text-muted-foreground text-sm">Overview content</p>
      </TabsContent>
      <TabsContent value="analytics" className="p-4">
        <p className="text-muted-foreground text-sm">Analytics content</p>
      </TabsContent>
    </Tabs>
  ),
}

export const ManyTabs: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="tab1">Overview</TabsTrigger>
        <TabsTrigger value="tab2">Analytics</TabsTrigger>
        <TabsTrigger value="tab3">Reports</TabsTrigger>
        <TabsTrigger value="tab4">Settings</TabsTrigger>
        <TabsTrigger value="tab5">Users</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="p-4">
        <p className="text-muted-foreground text-sm">Tab 1 content</p>
      </TabsContent>
      <TabsContent value="tab2" className="p-4">
        <p className="text-muted-foreground text-sm">Tab 2 content</p>
      </TabsContent>
      <TabsContent value="tab3" className="p-4">
        <p className="text-muted-foreground text-sm">Tab 3 content</p>
      </TabsContent>
      <TabsContent value="tab4" className="p-4">
        <p className="text-muted-foreground text-sm">Tab 4 content</p>
      </TabsContent>
      <TabsContent value="tab5" className="p-4">
        <p className="text-muted-foreground text-sm">Tab 5 content</p>
      </TabsContent>
    </Tabs>
  ),
}

export const WithDisabled: Story = {
  render: () => (
    <Tabs defaultValue="active" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="another">Another</TabsTrigger>
      </TabsList>
      <TabsContent value="active" className="p-4">
        <p className="text-muted-foreground text-sm">Active tab content</p>
      </TabsContent>
      <TabsContent value="another" className="p-4">
        <p className="text-muted-foreground text-sm">Another tab content</p>
      </TabsContent>
    </Tabs>
  ),
}
