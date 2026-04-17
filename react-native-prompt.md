# React Native Project Prompt

## Project Overview
This app is called "Groupify" - likely a group management/organization app with content tracking (animes, channels, groups).

## Technology Stack
- **Framework**: React Native with Expo
- **Navigation**: React Navigation v7 (native-stack for each tab, bottom tabs for main navigation)
- **State Management**: TanStack Query (react-query) for server state
- **HTTP Client**: Axios or fetch with the ApiClient pattern below
- **Forms**: React Hook Form + Zod validation
- **UI Components**: uniwind for tailwind classes compatibility

## API Client Pattern

Implement this ApiClient pattern (from `hooks/api/api-client.ts`):

```typescript
// src/api/client.ts
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = "https://your-api.com/api") {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T>
  async post<T>(endpoint: string, data?: unknown): Promise<T>
  async put<T>(endpoint: string, data?: unknown): Promise<T>
  async patch<T>(endpoint: string, data?: unknown): Promise<T>
  async delete<T>(endpoint: string): Promise<T>

  setAuthToken(token: string)
  removeAuthToken()
}

export const apiClient = new ApiClient();
export type ApiResponse<T> = { data: T; message?: string };
export type ApiError = { message: string; status: number; errors?: Record<string, string[]> };
```

## Type Definitions

### Auth Types (from `hooks/mutations/useAuthMutations.ts`)
```typescript
type LoginCredentials = { email: string; password: string };
type RegisterCredentials = { name: string; email: string; password: string; encryptedPassword: string };
type LoginResponse = { user: { id: string; email: string; name: string }; token?: string };
type RegisterResponse = { user: { id: string; email: string; name: string }; token?: string; message: string };
type ForgotPasswordRequest = { email: string; encrypted_password: string };
type ForgotPasswordResponse = { message: string; success: boolean };
```

### Common Types (add as you find more in hooks)
- User, Group, Channel, Anime, Website, ShareLink, GroupShelf, BlogPost
- Pagination types
- Dashboard totals

## Route Structure (Map to React Navigation)

| TanStack Route | Path | React Native Screen |
|----------------|------|---------------------|
| Root | `/` | HomeScreen (Landing) |
| AuthLogin | `/login` | LoginScreen |
| AuthRegister | `/register` | RegisterScreen |
| AuthForgotPassword | `/forgot-password` | ForgotPasswordScreen |
| AuthForgotPasswordConfirmId | `/forgot-password/confirm/$id` | ResetPasswordScreen |
| AuthForgotPasswordSuccessEmail | `/forgot-password/success/$email` | ForgotPasswordSuccessScreen |
| AppIndex | `/` (within app) | DashboardScreen |
| AppTerms | `/terms` | TermsScreen |
| AppPrivacy | `/privacy` | PrivacyScreen |
| AppSupport | `/support` | SupportScreen |
| AppBlogIndex | `/blog` | BlogListScreen |
| AppBlogSlug | `/blog/$slug` | BlogPostScreen |
| AppDashboard | `/dashboard` | Main tabs (Tab Navigator) |
| - DashboardIndex | `/dashboard/` | DashboardHomeScreen |
| - DashboardGroups | `/dashboard/groups` | GroupsListScreen |
| - DashboardGroupsNew | `/dashboard/groups/new` | CreateGroupScreen |
| - DashboardGroupsId | `/dashboard/groups/$id` | GroupDetailScreen |
| - DashboardGroupsIdEdit | `/dashboard/groups/$id/edit` | EditGroupScreen |
| - DashboardGroupsIdShare | `/dashboard/groups/$id/share` | ShareGroupScreen |
| - DashboardGroupsIdAddChannel | `/dashboard/groups/$id/add-channel` | AddChannelToGroupScreen |
| - DashboardChannels | `/dashboard/channels` | ChannelsListScreen |
| - DashboardChannelsEditId | `/dashboard/channels/edit/$id` | EditChannelScreen |
| - DashboardChannelsChangeGroupId | `/dashboard/channels/change-group/$id` | ChangeChannelGroupScreen |
| - DashboardAnimes | `/dashboard/animes` | AnimesListScreen |
| - DashboardAnimesEditId | `/dashboard/animes/edit/$id` | EditAnimeScreen |
| - DashboardAnimesChangeGroupId | `/dashboard/animes/change-group/$id` | ChangeAnimeGroupScreen |
| - DashboardWebsites | `/dashboard/websites` | WebsitesScreen |
| - DashboardShareLinks | `/dashboard/share-links` | ShareLinksScreen |
| - DashboardGroupshelf | `/dashboard/groupshelf` | GroupShelfScreen |
| - DashboardSettings | `/dashboard/settings` | SettingsScreen (Stack) |
| - - SettingsAccount | `/dashboard/settings/account` | AccountSettingsScreen |
| - - SettingsAppearance | `/dashboard/settings/appearance` | AppearanceSettingsScreen |
| - - SettingsBilling | `/dashboard/settings/billing` | BillingScreen |
| - - SettingsGroups | `/dashboard/settings/groups` | GroupSettingsScreen |
| AppShareTypeId | `/share/$type/$id` | SharedContentScreen |

## Navigation Structure

```
Root (Stack)
├── AuthStack
│   ├── LoginScreen
│   ├── RegisterScreen
│   ├── ForgotPasswordScreen
│   ├── ResetPasswordScreen (param: id)
│   └── ForgotPasswordSuccessScreen (param: email)
├── AppStack
│   ├── TabNavigator (Bottom Tabs)
│   │   ├── HomeTab (Dashboard)
│   │   ├── GroupsTab
│   │   ├── ChannelsTab
│   │   ├── AnimesTab
│   │   └── MoreTab (websites, share-links, groupshelf, settings)
│   └── Modals/FullScreenStacks
│       ├── CreateGroupScreen
│       ├── GroupDetailScreen (Stack)
│       │   ├── EditGroupScreen
│       │   ├── ShareGroupScreen
│       │   └── AddChannelToGroupScreen
│       ├── EditChannelScreen
│       ├── ChangeChannelGroupScreen
│       ├── EditAnimeScreen
│       ├── ChangeAnimeGroupScreen
│       ├── BlogListScreen
│       ├── BlogPostScreen (param: slug)
│       ├── SettingsStack
│       │   ├── AccountSettingsScreen
│       │   ├── AppearanceSettingsScreen
│       │   ├── BillingScreen
│       │   └── GroupSettingsScreen
│       ├── TermsScreen
│       ├── PrivacyScreen
│       ├── SupportScreen
│       └── SharedContentScreen (params: type, id)
└── SubscriptionConfirmScreen (param: code)
```

## API Endpoints (based on hooks)

```
POST /authorize - Login
POST /registration - Register
POST /forget-password - Forgot password
GET  /api/v3/me - Current user
GET  /api/v3/groups - List groups (paginated)
POST /api/v3/groups - Create group
GET  /api/v3/groups/:id - Get group
PUT  /api/v3/groups/:id - Update group
DELETE /api/v3/groups/:id - Delete group
PUT  /api/v2/groups/:id/display-order - Update group order
PUT  /api/v2/groups/display-order/bulk - Bulk update order
POST /api/v3/groups/:id/videos/sync - Sync group videos

GET  /api/v3/channels - List channels (paginated)
GET  /api/v3/channels/:id - Get channel
POST /api/v3/channels - Create channel
PATCH /api/v3/channels/:id - Update channel
DELETE /api/v2/channels/:id - Delete channel

GET  /api/v3/animes - List animes (paginated)

GET  /api/v2/websites - List websites (paginated)
DELETE /api/v2/channels/:id - Delete website

GET  /api/v3/share-links - List share links
POST /api/v3/share-links - Create share link
DELETE /api/v3/share-links/:id - Delete share link

GET  /groupshelf - Get group shelf
POST /groupshelf - Update group shelf

GET  /blog/posts - Get blog posts
GET  /blog/posts/:slug - Get single post

GET  /api/v3/dashboard - Dashboard totals

POST /api/v3/payments/checkout - Create checkout session
POST /api/v3/payments/cancel - Cancel subscription
```

## Authentication Flow
1. Store auth token in AsyncStorage
2. On app start, check for stored token and set on apiClient
3. Handle 401 responses by clearing storage and navigating to login
4. Use TanStack Query with staleTime for caching user data

## Key Implementation Notes
- Handle token correlation ID (x-correlation-id header with user ID)
- Use proper error handling with toast notifications
- Implement pull-to-refresh on list screens
- Use FlatList with proper pagination (cursor or page-based)
- Handle loading states with Skeleton components
- Use SafeAreaView for notch handling
- Implement proper keyboard avoiding behavior for forms