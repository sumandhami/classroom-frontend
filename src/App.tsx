import { Authenticated } from "@refinedev/core";
import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import {dataProvider} from "@/providers/data.ts";
import {authProvider} from "@/providers/auth-provider.ts";
import Dashboard from "@/pages/dashboard.tsx";
import {BookOpen, GraduationCap, Home} from "lucide-react";
import {Layout} from "@/components/refine-ui/layout/layout.tsx";
import SubjectsList from "@/pages/subjects/list.tsx";
import SubjectsCreate from "@/pages/subjects/create.tsx";
import SubjectsEdit from "@/pages/subjects/edit.tsx";
import ClassesList from "@/pages/classes/list.tsx";
import ClassesCreate from "@/pages/classes/create.tsx";
import ClassesEdit from "@/pages/classes/edit.tsx";
import ClassesShow from "@/pages/classes/show.tsx";
import DepartmentsList from "@/pages/departments/list.tsx";
import DepartmentsCreate from "@/pages/departments/create.tsx";
import DepartmentsEdit from "@/pages/departments/edit.tsx";
import UsersList from "@/pages/users/list.tsx";
import UsersEdit from "@/pages/users/edit.tsx";
import AccountPage from "@/pages/account/account.tsx";
import {Building2, Users as UsersIcon, UserCircle} from "lucide-react";

//import auth pages
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/signup";
import ForgotPasswordPage from "./pages/auth/forgotpass";
import VerifyEmailPage from "./pages/auth/verify-email";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                // projectId: "GOzXC3-c530XE-cSmPdZ",
              }}
              resources={[
                  {
                      name: 'dashboard',
                      list: '/',
                      meta: { label: 'Home', icon: <Home />, dataProviderName: 'default'}
                  },
                  {
                      name: 'departments',
                      list: '/departments',
                      create: '/departments/create',
                      edit: '/departments/edit/:id',
                      meta: { label: 'Departments', icon: <Building2 />}
                  },
                  {
                      name: 'subjects',
                      list: '/subjects',
                      create: '/subjects/create',
                      edit: '/subjects/edit/:id',
                      meta: { label: 'Subjects', icon: <BookOpen />}
                  },
                  {
                      name: 'classes',
                      list: '/classes',
                      create: '/classes/create',
                      edit: '/classes/edit/:id',
                      show: '/classes/show/:id',
                      meta: { label: 'Classes', icon: <GraduationCap />}
                  },
                  {
                      name: 'users',
                      list: '/users',
                      edit: '/users/edit/:id',
                      meta: { label: 'Users', icon: <UsersIcon />}
                  },
                  {
                      name: 'account',
                      list: '/account',
                      meta: { label: 'Account', icon: <UserCircle />}
                  },
              ]}
            >
              <Routes>
                  {/* ✅ PUBLIC ROUTES - No authentication needed */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />

                  {/* ✅ PROTECTED ROUTES - Must be logged in */}
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-layout"
                        // fallback={<div>Checking authentication...</div>}
                        redirectOnFail="/login"
                        loading={<div>Checking authentication...</div>}
                      >
                        <Layout>
                          <Outlet />
                        </Layout>
                      </Authenticated>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="departments">
                      <Route index element={<DepartmentsList />} />
                      <Route path="create" element={<DepartmentsCreate />} />
                      <Route path="edit/:id" element={<DepartmentsEdit />} />
                    </Route>
                    <Route path="subjects">
                      <Route index element={<SubjectsList />} />
                      <Route path="create" element={<SubjectsCreate />} />
                      <Route path="edit/:id" element={<SubjectsEdit />} />
                    </Route>
                    <Route path="classes">
                      <Route index element={<ClassesList />} />
                      <Route path="create" element={<ClassesCreate />} />
                      <Route path="edit/:id" element={<ClassesEdit />} />
                      <Route path="show/:id" element={<ClassesShow />} />
                    </Route>
                    <Route path="users">
                      <Route index element={<UsersList />} />
                      <Route path="edit/:id" element={<UsersEdit />} />
                    </Route>
                    <Route path="account" element={<AccountPage />} />
                  </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;