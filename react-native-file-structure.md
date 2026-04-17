# React Native Project - File Structure & UI Components

## Project Overview
This document maps the TanStack Start web app to React Native with Expo, including file structure and UI components used on each page.

---

## File Structure

```
groupify-rn/
├── src/
│   ├── api/
│   │   ├── client.ts              # API client (ApiClient pattern)
│   │   └── types.ts               # All TypeScript interfaces
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Switch.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Form.tsx           # React Hook Form wrapper
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Separator.tsx
│   │   │   ├── Progress.tsx
│   │   │   ├── Toast.tsx          # Sonner-style toasts
│   │   │   ├── DropdownMenu.tsx
│   │   │   ├── Popover.tsx
│   │   │   ├── Alert.tsx
│   │   │   ├── Label.tsx
│   │   │   ├── TextArea.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── Calendar.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── Accordion.tsx
│   │   │   ├── Drawer.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   └── Icons.tsx          # Icon library (lucide-react)
│   │   ├── dashboard-header.tsx
│   │   ├── group-form.tsx
│   │   ├── group-details.tsx
│   │   ├── group-list.tsx
│   │   ├── groups-table.tsx
│   │   ├── group-videos-list.tsx
│   │   ├── all-channels-table.tsx
│   │   ├── channels-table.tsx
│   │   ├── all-animes-table.tsx
│   │   ├── all-websites-table.tsx
│   │   ├── share-links-table.tsx
│   │   ├── dashboard-stats.tsx
│   │   ├── recent-activity.tsx
│   │   ├── shared-groups-overview.tsx
│   │   ├── upgrade-plan-modal.tsx
│   │   ├── icon-picker.tsx
│   │   ├── compact-header.tsx
│   │   ├── main-navbar.tsx
│   │   ├── top-channels-table.tsx
│   │   ├── recommendation-cards.tsx
│   │   ├── language-selector.tsx
│   │   ├── not-found.tsx
│   │   ├── landing-page.tsx
│   │   └── settings/
│   │       ├── account-settings.tsx
│   │       ├── appearance-settings.tsx
│   │       ├── billing-settings.tsx
│   │       ├── group-settings.tsx
│   │       ├── notification-settings.tsx
│   │       └── data-privacy-settings.tsx
│   ├── hooks/
│   │   ├── queries/
│   │   │   ├── useUser.ts
│   │   │   ├── useGroups.ts
│   │   │   ├── useGroupVideos.ts
│   │   │   ├── useChannels.ts
│   │   │   ├── useAnimes.ts
│   │   │   ├── useWebsites.ts
│   │   │   ├── useShareLinks.ts
│   │   │   ├── useShare.ts
│   │   │   ├── useDashboard.ts
│   │   │   ├── useBlog.ts
│   │   │   └── useGroupShelf.ts
│   │   └── mutations/
│   │       ├── useAuthMutations.ts
│   │       ├── useUserMutations.ts
│   │       └── usePaymentMutations.ts
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── AppNavigator.tsx
│   │   └── types.ts
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   ├── ResetPasswordScreen.tsx
│   │   │   └── ForgotPasswordSuccessScreen.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardHomeScreen.tsx
│   │   │   └── index.tsx           # Tab container
│   │   ├── groups/
│   │   │   ├── GroupsListScreen.tsx
│   │   │   ├── CreateGroupScreen.tsx
│   │   │   ├── GroupDetailScreen.tsx
│   │   │   ├── EditGroupScreen.tsx
│   │   │   ├── ShareGroupScreen.tsx
│   │   │   └── AddChannelToGroupScreen.tsx
│   │   ├── channels/
│   │   │   ├── ChannelsListScreen.tsx
│   │   │   ├── EditChannelScreen.tsx
│   │   │   └── ChangeChannelGroupScreen.tsx
│   │   ├── animes/
│   │   │   ├── AnimesListScreen.tsx
│   │   │   ├── EditAnimeScreen.tsx
│   │   │   └── ChangeAnimeGroupScreen.tsx
│   │   ├── websites/
│   │   │   └── WebsitesScreen.tsx
│   │   ├── share-links/
│   │   │   └── ShareLinksScreen.tsx
│   │   ├── groupshelf/
│   │   │   └── GroupShelfScreen.tsx
│   │   ├── settings/
│   │   │   ├── SettingsScreen.tsx
│   │   │   ├── AccountSettingsScreen.tsx
│   │   │   ├── AppearanceSettingsScreen.tsx
│   │   │   ├── BillingScreen.tsx
│   │   │   └── GroupSettingsScreen.tsx
│   │   ├── blog/
│   │   │   ├── BlogListScreen.tsx
│   │   │   └── BlogPostScreen.tsx
│   │   ├── shared/
│   │   │   └── SharedContentScreen.tsx
│   │   └── static/
│   │       ├── TermsScreen.tsx
│   │       ├── PrivacyScreen.tsx
│   │       └── SupportScreen.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── LanguageContext.tsx
│   ├── utils/
│   │   ├── storage.ts             # AsyncStorage helpers
│   │   ├── constants.ts
│   │   └── helpers.ts
│   └── App.tsx
├── assets/
│   └── icons/                     # Custom icons
├── package.json
├── app.json
└── tsconfig.json
```

---

## Screen-to-UI Components Mapping

### Authentication Screens

#### LoginScreen (`/login`)
- `CompactHeader` - Top navigation bar
- `Alert` - Error messages display
- `Form` (React Hook Form) - Login form wrapper
- `FormField` → `Input` - Email input with icon
- `Input` - Password input with visibility toggle
- `Button` - Submit button (gradient: red to pink)
- `Button` (outline) - Google/Discord social login
- `Separator` - "Or" divider
- **Icons**: `Eye`, `EyeOff`, `Lock`, `Mail`, `Sparkles`, `ArrowRight`

#### RegisterScreen (`/register`)
- Same components as LoginScreen
- Additional: `Input` for name field, `Checkbox` for terms acceptance

#### ForgotPasswordScreen (`/forgot-password`)
- `CompactHeader`
- `Form` - Email input only
- `Button` - Submit button

#### ResetPasswordScreen (`/forgot-password/confirm/:id`)
- `Form` - New password + confirmation inputs
- `Input` type="password" with visibility toggle
- `Button` - Update password

#### ForgotPasswordSuccessScreen (`/forgot-password/success/:email`)
- Success message display
- `Button` - Back to login

---

### Main Dashboard

#### DashboardHomeScreen (`/dashboard`)
- `WelcomeSection` (custom)
  - `Avatar` - User profile picture with fallback
- `Button` - "New Group", "Share Links" quick actions
- `QuickActions` (custom) - Grid of 4 action cards
  - `Button` → icons: Plus, Users, Share2, Sparkles
- `DashboardStats` - Statistics cards (groups, channels, animes counts)
- `Tabs` → `TabsList`, `TabsTrigger`, `TabsContent`
  - `TabsContent value="groups"` → `GroupList` + `RecentActivity`
  - `TabsContent value="shared"` → `SharedGroupsOverview`
- **Components**: `Avatar`, `Badge`, `Button`, `Tabs`

---

### Groups Screens

#### GroupsListScreen (`/dashboard/groups`)
- `DashboardHeader` - Title + description
- `Button` - "New Group" with upgrade modal trigger
- `Card` → `CardContent` - Container
- `GroupsTable` - Table with:
  - `IconViewer` - Group icon display
  - `Badge` - Group type/visibility
  - `Button` - Actions (edit, delete, share)
  - `Input` - Search/filter
- `UpgradePlanModal` - Pro upgrade prompt

#### CreateGroupScreen (`/dashboard/groups/new`)
- `DashboardHeader`
- `GroupForm` - Form with:
  - `Input` - Group name
  - `IconPicker` - Icon selection
  - `Select` - Parent group selector
  - `Switch` - Visibility toggle
  - `Button` - Submit/Cancel

#### GroupDetailScreen (`/dashboard/groups/:id`)
- Breadcrumb navigation (`Link` + `ChevronRight`)
- Child groups grid: `Avatar` + `IconViewer`
- `GroupDetails` - Group info card
- `Tabs` - "Channels" / "Videos"
  - `TabsContent value="channels"` → `ChannelsTable`
  - `TabsContent value="videos"` → `GroupVideosList`
- `Badge` - Channel count
- `Skeleton` - Loading states

#### EditGroupScreen (`/dashboard/groups/:id/edit`)
- `GroupForm` - Pre-filled with existing data

#### ShareGroupScreen (`/dashboard/groups/:id/share`)
- `ShareLinksTable` - List of share links
- Create share link functionality

#### AddChannelToGroupScreen (`/dashboard/groups/:id/add-channel`)
- `DashboardHeader`
- `Input` - Search channels
- `Tabs` - "All Channels" / "In Group" / "Not in Group"
- `Card` → `Avatar`, `Checkbox`, `Button`

---

### Channels Screens

#### ChannelsListScreen (`/dashboard/channels`)
- `DashboardHeader`
- `Card` → `AllChannelsTable`
- `Input` - Search
- `Avatar` + `Button` - Actions

#### EditChannelScreen (`/dashboard/channels/edit/:id`)
- Form with channel details
- `Select` - Group assignment
- `GenericCombobox` - Group selector

#### ChangeChannelGroupScreen (`/dashboard/channels/change-group/:id`)
- Group selector interface

---

### Animes Screens

#### AnimesListScreen (`/dashboard/animes`)
- `DashboardHeader`
- `Card` → `AllAnimesTable`
- `Input`, `Avatar`, `GenericCombobox`

#### EditAnimeScreen (`/dashboard/animes/edit/:id`)
- Similar to EditChannelScreen

#### ChangeAnimeGroupScreen (`/dashboard/animes/change-group/:id`)
- Similar to ChangeChannelGroupScreen

---

### Other Screens

#### WebsitesScreen (`/dashboard/websites`)
- `DashboardHeader`
- `AllWebsitesTable`

#### ShareLinksScreen (`/dashboard/share-links`)
- `DashboardHeader`
- `ShareLinksTable`
- `IconViewer`, `Avatar`

#### GroupShelfScreen (`/dashboard/groupshelf`)
- `DashboardHeader`
- `IconPicker`
- `Input` - Search
- `Card` components for shelf items

#### Settings Screens (`/dashboard/settings/*`)

**AccountSettingsScreen**
- `AccountSettings` component:
  - `Avatar` - Profile picture
  - `Input` - Name, email fields
  - `Button` - Save changes
  - `Dialog` - Delete account confirmation
  - `Checkbox` - Notifications toggle

**AppearanceSettingsScreen**
- `AppearanceSettings` component:
  - Theme toggle (dark/light)
  - `Select` - Color scheme

**BillingScreen**
- `BillingSettings` component:
  - Current plan display
  - Upgrade prompts
  - Payment history

**GroupSettingsScreen**
- `GroupSettings` component:
  - Group preferences

---

### Static Pages

#### BlogListScreen (`/blog`)
- Blog posts list
- Pagination

#### BlogPostScreen (`/blog/:slug`)
- Markdown renderer (`Markdown` component)
- Article content

#### TermsScreen (`/terms`)
- Static legal text

#### PrivacyScreen (`/privacy`)
- Static legal text

#### SupportScreen (`/support`)
- Support form/content

#### SharedContentScreen (`/share/:type/:id`)
- Public share link content
- Loading states

---

## UI Component Reference

### Core Components (Shadcn-inspired)

| Web Component | React Native Equivalent |
|--------------|------------------------|
| Button | `TouchableOpacity` + `Text` or `Button` from UI lib |
| Input | `TextInput` with styled container |
| Card | `View` with shadow/border |
| Avatar | `Image` in circular container |
| Badge | `View` + `Text` (pill shape) |
| Tabs | Custom tab bar or `@react-navigation/material-top-tabs` |
| Dialog | `Modal` from React Native |
| Select | `Picker` or custom modal |
| Switch | `Switch` from React Native |
| Checkbox | Custom checkbox with `TouchableOpacity` |
| Form | `React Hook Form` with controlled inputs |
| Skeleton | `View` with shimmer animation |
| Separator | `View` with border |
| DropdownMenu | `ActionSheetIOS` or custom modal |
| Toast | `Toast` library (react-native-toast-message) |
| Alert | `Alert.alert` or custom modal |

### Custom Components

| Component | Purpose |
|-----------|---------|
| `DashboardHeader` | Page title + description + actions |
| `GroupForm` | Create/edit group form |
| `GroupsTable` | Groups list with actions |
| `GroupList` | Recent groups for dashboard |
| `GroupDetails` | Single group info card |
| `GroupVideosList` | Videos in a group |
| `AllChannelsTable` | All channels with search |
| `ChannelsTable` | Channels in a group |
| `AllAnimesTable` | All animes list |
| `AllWebsitesTable` | All websites list |
| `ShareLinksTable` | Share links management |
| `DashboardStats` | Stats cards (groups, channels, animes) |
| `RecentActivity` | Activity feed |
| `SharedGroupsOverview` | Shared groups section |
| `UpgradePlanModal` | Pro upgrade CTA |
| `IconPicker` | Icon selection grid |
| `CompactHeader` | Minimal header |
| `MainNavbar` | Main navigation |
| `LanguageSelector` | Language dropdown |

---

## Navigation Structure

```
RootNavigator (Stack)
├── AuthNavigator (Stack)
│   ├── LoginScreen
│   ├── RegisterScreen
│   ├── ForgotPasswordScreen
│   ├── ResetPasswordScreen
│   └── ForgotPasswordSuccessScreen
├── AppNavigator (Tab Navigator)
│   ├── HomeStack
│   │   └── DashboardHomeScreen
│   ├── GroupsStack
│   │   ├── GroupsListScreen
│   │   ├── CreateGroupScreen
│   │   ├── GroupDetailScreen
│   │   ├── EditGroupScreen
│   │   ├── ShareGroupScreen
│   │   └── AddChannelToGroupScreen
│   ├── ChannelsStack
│   │   ├── ChannelsListScreen
│   │   ├── EditChannelScreen
│   │   └── ChangeChannelGroupScreen
│   ├── AnimesStack
│   │   ├── AnimesListScreen
│   │   ├── EditAnimeScreen
│   │   └── ChangeAnimeGroupScreen
│   └── MoreStack
│       ├── WebsitesScreen
│       ├── ShareLinksScreen
│       ├── GroupShelfScreen
│       └── SettingsNavigator
│           ├── SettingsScreen
│           ├── AccountSettingsScreen
│           ├── AppearanceSettingsScreen
│           ├── BillingScreen
│           └── GroupSettingsScreen
├── BlogNavigator (Stack)
│   ├── BlogListScreen
│   └── BlogPostScreen
├── StaticNavigator (Stack)
│   ├── TermsScreen
│   ├── PrivacyScreen
│   └── SupportScreen
└── SharedNavigator (Stack)
    └── SharedContentScreen
```

---

## Key Implementation Notes

1. **Icons**: Use `lucide-react-native` or `@expo/vector-icons` (Ionicons, MaterialCommunityIcons)
2. **Forms**: Use `react-hook-form` with `@hookform/resolvers/zod`
3. **Tables**: Replace with `FlatList` with row components
4. **Tabs**: Use `@react-navigation/bottom-tabs` + `createNativeStackNavigator`
5. **Dialogs**: Use React Native `Modal` component
6. **Toasts**: Use `react-native-toast-message` or `notifee` for notifications
7. **Skeleton**: Create shimmer animation with `Animated.View`
8. **Safe Area**: Use `SafeAreaView` from `react-native-safe-area-context`
9. **Keyboard**: Use `KeyboardAvoidingView` for forms