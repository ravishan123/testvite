import { Layout } from "@/components/custom/layout";
import { UserNav } from "@/components/user-nav";
import OrganizationsTable from "./components/organizations";
export default function Tasks() {
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <div className="mb-2 mt-4 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Manage Organizations
            </h2>
            <p className="text-muted-foreground">Showing 65 organizations</p>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <OrganizationsTable />
        </div>
      </Layout.Body>
    </Layout>
  );
}
