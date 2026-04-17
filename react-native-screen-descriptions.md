# Screen-by-Screen Descriptions for React Native Conversion

This document provides detailed descriptions for each screen in the Groupify app, explaining what it does, its key features, and how to adapt it for mobile.

---

## Authentication Screens

### 1. LoginScreen (`/login`)
**Purpose**: User authentication entry point

**Key Features**:
- Email input with validation (Zod schema - must be valid email)
- Password input with show/hide toggle
- "Forgot Password" link
- Submit button with loading state
- Social login buttons (Google, Discord) - these redirect to web OAuth flow
- "Sign up" link for new users

**Mobile Adaptation**:
- Full-screen form centered vertically
- Use `KeyboardAvoidingView` to handle keyboard
- Replace social buttons with "Continue with Google/Discord" that opens in-device browser or uses native OAuth
- Show validation errors inline below each field
- Consider biometric login (Face ID/Touch ID) as option
- Remember me toggle

---

### 2. RegisterScreen (`/register`)
**Purpose**: New user registration

**Key Features**:
- Name, email, password, confirm password fields
- Password visibility toggles
- Terms & privacy policy checkbox with links
- Form validation with Zod (passwords must match, min 6 chars, email valid)
- Social signup options (Google, Discord)
- Already have account link

**Mobile Adaptation**:
- Same layout pattern as login
- Add scroll view for smaller screens
- Links to terms/privacy should open WebView or native browser
- Consider multi-step form for better UX on mobile (name → email → password)
- Show password strength indicator

---

### 3. ForgotPasswordScreen (`/forgot-password`)
**Purpose**: Password reset request

**Key Features**:
- Single email input field
- Submit button to send reset email
- Back to login link

**Mobile Adaptation**:
- Simple centered form
- On success, navigate to ForgotPasswordSuccessScreen with email param

---

### 4. ForgotPasswordSuccessScreen (`/forgot-password/success/:email`)
**Purpose**: Confirmation after reset email sent

**Key Features**:
- Success message with email displayed
- Link back to login

**Mobile Adaptation**:
- Simple success state with illustration/icon
- "Back to Login" button

---

### 5. ResetPasswordScreen (`/forgot-password/confirm/:id`)
**Purpose**: Set new password using reset token

**Key Features**:
- New password + confirm password fields
- Password visibility toggles
- Submit to update password

**Mobile Adaptation**:
- Two password fields with visibility toggles
- Show password requirements inline

---

## Main App Screens

### 6. LandingScreen (`/`)
**Purpose**: Marketing landing page for unauthenticated users

**Key Features**:
- Hero section with app description
- Feature highlights
- Call to actions (Get Started, Login)
- This is wrapped by `LandingPage` component

**Mobile Adaptation**:
- Convert to scrollable page with sections
- Bottom sticky CTA button
- Swipeable feature carousel
- Use native animations (Reanimated)

---

### 7. DashboardHomeScreen (`/dashboard`)
**Purpose**: Main dashboard after login

**Key Features**:
- Welcome section with user name/avatar (greeting based on time of day)
- Quick action buttons (New Group, Share Links)
- Statistics cards showing totals (groups, channels, animes)
- Tabs: "Your Groups" and "Shared" content
- Recent Groups list with thumbnails
- Recent Activity feed

**Mobile Adaptation**:
- Bottom tab navigation for main sections
- Welcome card at top with greeting
- Horizontal scroll for quick actions
- Stats as horizontal row of mini cards
- Use SegmentedControl for tabs instead of Tabs
- FlatList for groups/activity with pull-to-refresh

---

### 8. GroupsListScreen (`/dashboard/groups`)
**Purpose**: List all user groups

**Key Features**:
- Header with title/description
- "New Group" button
- Table/grid of groups with icon, name, channel count, actions
- Upgrade modal if user can't add more groups
- Loading and error states
- Ad banner placeholder

**Mobile Adaptation**:
- FlatList with group cards (icon + name + channel count)
- Swipe actions for edit/delete
- FAB for "New Group" instead of header button
- Pull-to-refresh
- Empty state when no groups

---

### 9. CreateGroupScreen (`/dashboard/groups/new`)
**Purpose**: Create a new group

**Key Features**:
- Uses `GroupForm` component with fields:
  - Name (required)
  - Description
  - Category (dropdown)
  - Icon picker
  - Parent group selector
  - Enable Groupshelf toggle
- Loading state during creation

**Mobile Adaptation**:
- Form screen with sections
- Icon picker as horizontal scroll or grid modal
- Parent group as bottom sheet selector
- Keyboard avoiding view
- Submit creates and navigates back to groups list

---

### 10. GroupDetailScreen (`/dashboard/groups/:id`)
**Purpose**: View single group details

**Key Features**:
- Breadcrumb navigation for hierarchy
- Child groups grid (clickable)
- Group details card
- Tabs: "Channels" and "Videos"
- Auto-syncs videos on mount
- Loading skeletons

**Mobile Adaptation**:
- Header with back button and group title
- Horizontal scroll for child groups (if any)
- SegmentedControl for Channels/Videos tabs
- Channels as FlatList with channel cards
- Videos as FlatList with video thumbnails
- Pull-to-refresh for video sync

---

### 11. EditGroupScreen (`/dashboard/groups/:id/edit`)
**Purpose**: Update existing group

**Key Features**:
- Same `GroupForm` as create but pre-filled
- Shows current values (name, description, icon, etc.)
- Save button
- Loading state

**Mobile Adaptation**:
- Same form as CreateGroupScreen
- Pre-populate all fields from fetched group
- Show "Delete Group" option in menu

---

### 12. ShareGroupScreen (`/dashboard/groups/:id/share`)
**Purpose**: Manage share links for a group

**Key Features**:
- Create new share link functionality
- List of existing share links with:
  - Link details (type, creation date)
  - Copy link button
  - Delete option

**Mobile Adaptation**:
- Modal or sheet to create link
- List of share links with swipe to delete
- "Copy" button shows toast "Link copied!"

---

### 13. AddChannelToGroupScreen (`/dashboard/groups/:id/add-channel`)
**Purpose**: Add channels to a group

**Key Features**:
- Search channels input
- Tabs: All Channels, In Group, Not in Group
- Channel list with checkboxes
- Upgrade modal if limit reached

**Mobile Adaptation**:
- Search bar at top
- SegmentedControl for tabs
- FlatList with checkboxes
- Multi-select with "Add Selected" button at bottom
- Show selected count

---

### 14. ChannelsListScreen (`/dashboard/channels`)
**Purpose**: View all channels across groups

**Key Features**:
- Header with title
- Table of all channels with search
- Channel info: avatar, name, group, subscriber count
- Actions: edit, change group, delete
- Ad banner placeholder

**Mobile Adaptation**:
- FlatList with channel cards
- Search bar filters list
- Bottom sheet for actions (edit, change group, delete)
- Pull-to-refresh

---

### 15. EditChannelScreen (`/dashboard/channels/edit/:id`)
**Purpose**: Edit channel details

**Key Features**:
- Form with channel name, group assignment
- Use `GenericCombobox` for group selector

**Mobile Adaptation**:
- Form with TextInput fields
- Bottom sheet for group selection

---

### 16. ChangeChannelGroupScreen (`/dashboard/channels/change-group/:id`)
**Purpose**: Move channel to different group

**Key Features**:
- Group selector to change parent group

**Mobile Adaptation**:
- List of groups as options
- Radio button selection
- Confirm button

---

### 17. AnimesListScreen (`/dashboard/animes`)
**Purpose**: View all anime channels

**Key Features**:
- Similar to ChannelsListScreen
- Table of anime channels

**Mobile Adaptation**:
- Same pattern as ChannelsListScreen
- Use anime-specific icons/thumbnails

---

### 18. EditAnimeScreen (`/dashboard/animes/edit/:id`)
**Purpose**: Edit anime details

**Mobile Adaptation**:
- Same as EditChannelScreen

---

### 19. ChangeAnimeGroupScreen (`/dashboard/animes/change-group/:id`)
**Purpose**: Move anime to different group

**Mobile Adaptation**:
- Same as ChangeChannelGroupScreen

---

### 20. WebsitesScreen (`/dashboard/websites`)
**Purpose**: View all websites

**Key Features**:
- List of websites with details
- Delete functionality

**Mobile Adaptation**:
- FlatList of website cards
- Swipe to delete

---

### 21. ShareLinksScreen (`/dashboard/share-links`)
**Purpose**: Manage all share links

**Key Features**:
- "Create New Link" button opens group selector dialog
- List of all share links
- Group selector modal to create new link

**Mobile Adaptation**:
- FAB for creating new link
- FlatList of share links
- Bottom sheet for create link (select group first)

---

### 22. GroupShelfScreen (`/dashboard/groupshelf`)
**Purpose**: Browse and copy public group templates

**Key Features**:
- Search input
- Table of public groups
- Copy action to duplicate template
- Pagination
- Loading and empty states

**Mobile Adaptation**:
- Search bar at top
- FlatList with group cards
- "Copy" button on each card
- Load more on scroll
- Empty state when no results

---

## Settings Screens

### 23. SettingsScreen (`/dashboard/settings`)
**Purpose**: Settings hub - acts as container for nested routes

**Mobile Adaptation**:
- List of setting categories as menu items
- Navigate to nested stack screens

---

### 24. AccountSettingsScreen (`/dashboard/settings/account`)
**Purpose**: Manage user account

**Key Features**:
- Uses `AccountSettings` component with:
  - Avatar with upload option
  - Name and email fields
  - Save button
  - Delete account dialog
  - Notification preferences checkboxes

**Mobile Adaptation**:
- Profile section at top with avatar
- Form for name/email
- Toggle switches for notifications
- "Delete Account" as destructive action at bottom

---

### 25. AppearanceSettingsScreen (`/dashboard/settings/appearance`)
**Purpose**: Theme and display preferences

**Key Features**:
- Theme toggle (dark/light)
- Color scheme selector

**Mobile Adaptation**:
- SegmentedControl for theme
- List of color options

---

### 26. BillingScreen (`/dashboard/settings/billing`)
**Purpose**: Subscription management

**Key Features**:
- Uses `BillingSettings` component
- Current plan display
- Upgrade options
- Payment history

**Mobile Adaptation**:
- Current plan card
- Upgrade options as cards
- List of past payments

---

### 27. GroupSettingsScreen (`/dashboard/settings/groups`)
**Purpose**: Group-related preferences

**Mobile Adaptation**:
- List of group preferences toggles

---

## Static/Content Screens

### 28. BlogListScreen (`/blog`)
**Purpose**: Blog post listing

**Key Features**:
- Hero section with title
- Sticky category filter (horizontal scroll pills)
- Search input
- Featured post (large card)
- Trending posts (3 cards)
- Posts grid
- Pagination

**Mobile Adaptation**:
- ScrollView with sections
- Horizontal scroll for category pills
- Featured post as full-width card at top
- Trending as horizontal scroll
- Grid of posts (2 columns)
- Load more on scroll

---

### 29. BlogPostScreen (`/blog/:slug`)
**Purpose**: Single blog article

**Key Features**:
- Markdown rendered content
- Article metadata (author, date, category)

**Mobile Adaptation**:
- ScrollView with markdown content
- Use react-native-render-html for markdown
- Share button in header

---

### 30. TermsScreen (`/terms`)
**Purpose**: Terms of Service legal page

**Mobile Adaptation**:
- ScrollView with text content
- Open links in WebView

---

### 31. PrivacyScreen (`/privacy`)
**Purpose**: Privacy Policy legal page

**Mobile Adaptation**:
- Same as TermsScreen

---

### 32. SupportScreen (`/support`)
**Purpose**: Help and support options

**Key Features**:
- Hero with "How can we help"
- Discord community card (prominent)
- Email support card
- GitHub open source card
- Footer with links

**Mobile Adaptation**:
- ScrollView with cards
- "Join Discord" as primary CTA
- Email/GitHub as secondary options

---

### 33. SharedContentScreen (`/share/:type/:id`)
**Purpose**: View shared content via public link

**Key Features**:
- Public access (no auth required)
- Shows shared group/channel content

**Mobile Adaptation**:
- Loading state while fetching
- Display shared content
- "Join Groupify" CTA if not logged in

---

## Additional Settings & Feature Screens

### 34. GroupForm Component (Used by Create/Edit Group)
**Purpose**: Reusable form for creating/editing groups

**Key Features**:
- Name input (required)
- Description textarea
- Category dropdown
- Icon picker (grid of icons to choose)
- Parent group selector
- Enable Groupshelf toggle switch

**Mobile Adaptation**:
- Create as reusable screen component
- Icon picker as modal with grid
- Parent group as bottom sheet selector
- Form validation inline

---

### 35. ShareGroupScreen (`/dashboard/groups/:id/share`)
**Purpose**: Advanced share link management

**Key Features**:
- Tabs: "Collaborate" and "Copy"
- Collaborate tab:
  - Permission selector (RadioGroup): view, edit, admin
  - Generate share link button
  - Copy link functionality
  - Shows join role
- Copy tab:
  - Alert showing channel count
  - Generate copy link
  - Copy link functionality
- Sidebar showing group details (name, category, description, channel count)

**Mobile Adaptation**:
- SegmentedControl for tabs
- Radio button list for permissions
- Primary action button to generate link
- Input field with copy button for generated link
- Group details card
- Use `Clipboard` API from React Native

---

### 36. AppearanceSettings Component
**Purpose**: Theme customization

**Key Features**:
- Theme toggle (class-based with system default)
- Uses ThemeProvider wrapper

**Mobile Adaptation**:
- SegmentedControl: Light / Dark / System
- Persist preference in AsyncStorage
- Apply immediately on selection

---

### 37. BlogPostScreen (`/blog/:slug`)
**Purpose**: Individual blog article

**Key Features**:
- Back link to blog listing
- Category badge
- Title (large)
- Author info with avatar
- Publish date
- Social share buttons (Twitter, LinkedIn, generic share)
- Hero image
- Markdown content rendering
- Author bio section

**Mobile Adaptation**:
- ScrollView with all content
- Sticky header with share button
- Hero image as full-width
- Markdown rendered via react-native-markdown-display
- Share via React Native Share or WebShare API

---

### 38. ChannelsTable / AllChannelsTable Component
**Purpose**: Display channels in table format

**Key Features**:
- Avatar + name + group + subscriber count columns
- Search/filter input
- Actions (edit, change group, delete)
- Uses GenericCombobox for group selection

**Mobile Adaptation**:
- Convert to FlatList with row components
- Swipe actions for edit/delete
- Bottom sheet for actions
- Search filters list in real-time

---

### 39. GroupsTable Component
**Purpose**: Display groups in table/grid

**Key Features**:
- Icon + name + channel count
- Category badge
- Actions (edit, delete, share)
- Upgrade modal trigger

**Mobile Adaptation**:
- FlatList with card items
- Swipe actions
- FAB for new group

---

### 40. DashboardStats Component
**Purpose**: Show dashboard statistics

**Key Features**:
- Stats for: total groups, channels, animes, videos
- Uses API: `/api/v3/dashboard`

**Mobile Adaptation**:
- Horizontal row of stat cards
- Each card: icon + number + label
- Pull-to-refresh updates numbers

---

### 41. GroupList Component
**Purpose**: Recent groups for dashboard

**Key Features**:
- Compact list of recent groups
- Link to full groups list

**Mobile Adaptation**:
- Horizontal scroll or vertical list
- Each item: icon + name + channel count

---

### 42. RecentActivity Component
**Purpose**: Activity feed

**Key Features**:
- Recent actions/events
- Timestamps

**Mobile Adaptation**:
- FlatList of activity items
- Each item: icon + description + time ago

---

### 43. Settings Components (AccountSettings, BillingSettings, etc.)

**Key Features**:
- AccountSettings: Profile info, delete account, notifications
- BillingSettings: Plan info, upgrade options, payment history
- GroupSettings: Group preferences
- AppearanceSettings: Theme (covered above)
- NotificationSettings: Notification toggles
- DataPrivacySettings: Privacy options

**Mobile Adaptation**:
- Each as separate screen in settings stack
- Form inputs for editable fields
- Toggle switches for preferences
- Confirmation dialogs for destructive actions

---

## Common Component Adaptations

### Tables → FlatList
- Web tables become vertical FlatList
- Columns become stacked row elements or horizontal cards
- Pagination becomes infinite scroll or "Load More"

### Tabs → SegmentedControl
- Top tabs become segmented control
- Bottom tabs work well natively

### Modals → Bottom Sheets
- Dialog components become bottom sheets
- Use @gorhom/bottom-sheet for best UX

### Cards → Touchable Cards
- Clickable cards work natively
- Add haptic feedback on press

### Navigation
- Replace TanStack Router with React Navigation
- Stack navigators for flows
- Tab navigators for main sections

### Icons
- Use lucide-react-native or @expo/vector-icons
- Map Lucide icons to equivalent native icons

### Forms
- Use react-hook-form
- Zod for validation
- Inline errors as Text below inputs

### Loading States
- Skeleton components with shimmer
- ActivityIndicator for simple loading

### Toasts
- react-native-toast-message
- Configure with success/error variants matching app theme

---

## Key UI Patterns to Preserve

### Loading States
- Show skeleton loaders matching the content layout
- Use shimmer animation

### Error States
- Show error message with retry button

### Empty States
- Friendly message with illustration
- Action button if applicable

### Forms
- Inline validation with error messages below fields
- Submit button disabled while invalid
- Loading state on submit

### Navigation
- Stack navigation for flow
- Tab navigation for main sections
- Modal/sheet for quick actions

### Theming
- Gradient accent colors (red to pink)
- Dark mode support
- Consistent spacing and typography

---

## API Interactions

All screens use TanStack Query hooks. For React Native:
- Replace `useQuery` with `@tanstack/react-query`
- Keep same hook patterns
- Handle 401 by clearing auth and navigating to login

---

## Key Libraries to Use

| Feature | Library |
|---------|---------|
| Navigation | @react-navigation/native + stack + bottom-tabs |
| Forms | react-hook-form + zod |
| HTTP | axios or fetch with custom client |
| State | @tanstack/react-query |
| UI | Custom components or tamagui/gluestack |
| Icons | lucide-react-native or @expo/vector-icons |
| Storage | @react-native-async-storage/async-storage |
| Toasts | react-native-toast-message |
| Markdown | react-native-markdown-display |