import { Layout } from "@/components/custom/layout";
import { UserNav } from "@/components/user-nav";
import UsersVerified from "./components/users-verified";
import UnverifiedTable from "./components/users-unerified";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Tasks() {
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <div className="mb-2 mt-4 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Manage Users</h2>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <Tabs defaultValue="verified">
            <TabsList className="grid grid-cols-2 w-1/3">
              <TabsTrigger value="verified">Verified Users</TabsTrigger>
              <TabsTrigger value="unverified">Unverified Users</TabsTrigger>
            </TabsList>

            <TabsContent value="verified">
              <UsersVerified />
            </TabsContent>

            <TabsContent value="unverified">
              <UnverifiedTable />
            </TabsContent>
          </Tabs>
        </div>
      </Layout.Body>
    </Layout>
  );
}
