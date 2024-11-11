const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'Dashboard1',
            path: '/dashboards/dashboard1',
            component: () => import('@/views/dashboards/dashboard1/index.vue')
        },
        {
            name: 'All Users',
            path: '/users/allUser',
            component: () => import('@/views/users/allUser.vue')
        },
        {
            name: 'Add New User',
            path: '/users/addNewUser',
            component: () => import('@/views/users/addNewUser.vue')
        },
        {
            name: 'Verified Users',
            path: '/users/verifiedUser',
            component: () => import('@/views/users/verifiedUser.vue')
        },
        {
            name: 'Unverified Users',
            path: '/users/unverifiedUser',
            component: () => import('@/views/users/unverifiedUser.vue')
        },
        {
            name: 'Incomplete User Registrations',
            path: '/users/incompleteRegistration',
            component: () => import('@/views/users/incompleteRegistration.vue')
        },
        {
            name: 'User Profile',
            path: '/users/userProfile',
            component: () => import('@/views/users/userProfile.vue')
        },
        {
            name: 'Merchant Profile',
            path: '/merchants/merchantProfile',
            component: () => import('@/views/merchants/merchantProfile.vue')
        },
        {
            name: 'Agent Profile',
            path: '/agents/agentProfile',
            component: () => import('@/views/agents/agentProfile.vue')
        },
        {
            name: 'SubAccount Profile',
            path: '/merchants/subAccountProfile',
            component: () => import('@/views/merchants/subAccountProfile.vue')
        },
        {
            name: 'Admin Profile',
            path: '/admins/adminProfile',
            component: () => import('@/views/admins/adminProfile.vue')
        },
        {
            name: 'Biller Profile',
            path: '/billers/billerProfile',
            component: () => import('@/views/billers/billerProfile.vue')
        },
        {
            name: 'All Admins',
            path: '/admins/allAdmin',
            component: () => import('@/views/admins/allAdmin.vue')
        },
        {
            name: 'Add New Admin',
            path: '/admins/addNewAdmin',
            component: () => import('@/views/admins/addNewAdmin.vue')
        },
        {
            name: 'All Merchants',
            path: '/merchants/allMerchant',
            component: () => import('@/views/merchants/allMerchant.vue')
        },
        {
            name: 'Add New Merchant',
            path: '/merchants/addNewMerchant',
            component: () => import('@/views/merchants/addNewMerchant.vue')
        },
        {
            name: 'Verified Merchant',
            path: '/merchants/verifiedMerchant',
            component: () => import('@/views/merchants/verifiedMerchant.vue')
        },
        {
            name: 'Unverified Merchant',
            path: '/merchants/unverifiedMerchant',
            component: () => import('@/views/merchants/unverifiedMerchant.vue')
        },
        {
            name: 'Incomplete Merchant Registrations',
            path: '/merchants/incompleteRegistrationMerchant',
            component: () => import('@/views/merchants/incompleteRegistrationMerchant.vue')
        },
        {
            name: 'Merchant Sub-Accounts',
            path: '/merchants/subAccounts',
            component: () => import('@/views/merchants/subAccounts.vue')
        },
        {
            name: 'All Agents',
            path: '/agents/allAgent',
            component: () => import('@/views/agents/allAgent.vue')
        },
        {
            name: 'Add New Agent',
            path: '/agents/addNewAgent',
            component: () => import('@/views/agents/addNewAgent.vue')
        },
        {
            name: 'Verified Agents',
            path: '/agents/verifiedAgent',
            component: () => import('@/views/agents/verifiedAgents.vue')
        },
        {
            name: 'Unverified Agents',
            path: '/agents/unverifiedAgent',
            component: () => import('@/views/agents/unverifiedAgents.vue')
        },
        {
            name: 'Incomplete Agents Registrations',
            path: '/agents/incompleteAgentRegistration',
            component: () => import('@/views/agents/incompleteAgentRegistrations.vue')
        },
        {
            name: 'All Billers',
            path: '/billers/allBiller',
            component: () => import('@/views/billers/allBiller.vue')
        },
        {
            name: 'Biller Services',
            path: '/billers/billerService',
            component: () => import('@/views/billers/billerService.vue')
        },
        {
            name: 'Biller Report',
            path: '/billers/billerReport',
            component: () => import('@/views/billers/billerReport.vue')
        },
        {
            name: 'Biller Funds Withdrawal',
            path: '/billers/billerWithdrawalFund',
            component: () => import('@/views/billers/billerWithdrawalFund.vue')
        },
        {
            name: 'Fund Requests',
            path: '/reports/fundRequest',
            component: () => import('@/views/reports/fundRequest.vue')
        },
        {
            name: 'Admin Wallet History',
            path: '/reports/adminWalletHistory',
            component: () => import('@/views/reports/adminWalletHistory.vue')
        },
        {
            name: 'Master Wallet History',
            path: '/reports/masterWalletHistory',
            component: () => import('@/views/reports/masterWalletHistory.vue')
        },
        {
            name: 'Deposit View',
            path: '/reports/deposit',
            component: () => import('@/views/reports/deposit.vue')
        },
        {
            name: 'Withdrawal View',
            path: '/reports/withdrawals',
            component: () => import('@/views/reports/withdrawals.vue')
        },
        {
            name: 'Create Offer',
            path: '/rewards/createOffer',
            component: () => import('@/views/rewards/createOffer.vue')
        },
        {
            name: 'All Vouchers',
            path: '/rewards/allVouchers',
            component: () => import('@/views/rewards/allVouchers.vue')
        },
        {
            name: 'Reedemed Vouchers',
            path: '/rewards/reedemedVouchers',
            component: () => import('@/views/rewards/reedemedVouchers.vue')
        },
        {
            name: 'Voucher Information',
            path: '/rewards/voucherInformation',
            component: () => import('@/views/rewards/voucherInformation.vue')
        },
        {
            name: 'Ticket Type',
            path: '/tickets/ticketType',
            component: () => import('@/views/tickets/ticketType.vue')
        },
        {
            name: 'Ticket List',
            path: '/tickets/ticketList',
            component: () => import('@/views/tickets/ticketList.vue')
        },
        {
            name: 'App Grid',
            path: '/appGrid',
            component: () => import('@/views/appGrid.vue')
        },
        {
            name: 'Advertisement',
            path: '/advertisement',
            component: () => import('@/views/advertisement.vue')
        },
        {
            name: 'Admin Users',
            path: '/settings/adminUser',
            component: () => import('@/views/settings/adminUser.vue')
        },
        {
            name: 'Notifications',
            path: '/settings/notification',
            component: () => import('@/views/settings/notification.vue')
        },
        {
            name: 'User Activity',
            path: '/settings/userActivity',
            component: () => import('@/views/settings/userActivity.vue')
        },
        {
            name: 'Schemes',
            path: '/settings/schemes',
            component: () => import('@/views/settings/schemes.vue')
        },
        {
            name: 'Fequently Asked Questions',
            path: '/settings/fequentAskedQuestions',
            component: () => import('@/views/settings/fequentAskedQuestions.vue')
        },
        {
            name: 'Payment Charge Package',
            path: '/settings/paymentChargePackage',
            component: () => import('@/views/settings/paymentChargePackage.vue')
        },
        {
            name: 'System Settings',
            path: '/settings/systemSettings',
            component: () => import('@/views/settings/systemSettings.vue')
        },
        {
            name: 'System Bank',
            path: '/systemBank',
            component: () => import('@/views/systemBank.vue')
        },
        {
            name: 'Product detail',
            path: '/ecommerce/product/detail/:id',
            component: () => import('@/views/apps/eCommerce/ProductDetails.vue')
        },
        {
            name: 'Product Checkout',
            path: '/ecommerce/checkout',
            component: () => import('@/views/apps/eCommerce/ProductCheckout.vue')
        },
        {
            name: 'Product Listing',
            path: '/ecommerce/productlist',
            component: () => import('@/views/apps/eCommerce/ProductList.vue')
        },
        {
            name: 'Add Product',
            path: '/ecommerce/add-product',
            component: () => import('@/views/apps/eCommerce/AddProduct.vue')
        },
        {
            name: 'Edit Product',
            path: '/ecommerce/edit-product',
            component: () => import('@/views/apps/eCommerce/EditProduct.vue')
        },
        {
            name: 'Chats',
            path: '/apps/chats',
            component: () => import('@/views/apps/chat/Chats.vue')
        },
        {
            name: 'Email',
            path: '/apps/email',
            component: () => import('@/views/apps/email/Email.vue')
        },
        {
            name: 'ecom Products',
            path: '/ecommerce/products',
            component: () => import('@/views/apps/eCommerce/Products.vue')
        },
        {
            name: 'Product detail',
            path: '/ecommerce/product/detail/:id',
            component: () => import('@/views/apps/eCommerce/ProductDetails.vue')
        },
        {
            name: 'Product Checkout',
            path: '/ecommerce/checkout',
            component: () => import('@/views/apps/eCommerce/ProductCheckout.vue')
        },
        {
            name: 'Product Listing',
            path: '/ecommerce/productlist',
            component: () => import('@/views/apps/eCommerce/ProductList.vue')
        },
        {
            name: 'Posts',
            path: '/apps/blog/posts',
            component: () => import('@/views/apps/blog/Posts.vue')
        },
        {
            name: 'Detail',
            path: '/apps/blog/:id',
            component: () => import('@/views/apps/blog/Detail.vue')
        },

        {
            name: 'UserProfile',
            path: '/apps/user/profile',
            component: () => import('@/views/apps/user-profile/Profile.vue')
        },
        {
            name: 'UserFollowers',
            path: '/apps/user/profile/followers',
            component: () => import('@/views/apps/user-profile/Followers.vue')
        },
        {
            name: 'UserFriends',
            path: '/apps/user/profile/friends',
            component: () => import('@/views/apps/user-profile/Friends.vue')
        },
        {
            name: 'UserGallery',
            path: '/apps/user/profile/gallery',
            component: () => import('@/views/apps/user-profile/Gallery.vue')
        },
        {
            name: 'Notes',
            path: '/apps/notes',
            component: () => import('@/views/apps/notes/Notes.vue')
        },
        {
            name: 'Contact',
            path: '/apps/contacts',
            component: () => import('@/views/apps/contact/Contact.vue')
        },
        {
            name: 'Calendar',
            path: '/apps/calendar',
            component: () => import('@/views/apps/calendar/Calendar.vue')
        },
        {
            name: 'Kanban',
            path: '/apps/kanban',
            component: () => import('@/views/apps/kanban/Kanban.vue')
        },
        {
            name: 'Pricing',
            path: '/pages/pricing',
            component: () => import('@/views/pages/pricing/Pricing.vue')
        },
        {
            name: 'Account Setting',
            path: '/pages/account-settings',
            component: () => import('@/views/pages/account-settings/AccountSettings.vue')
        },
        {
            name: 'FAQ',
            path: '/pages/faq',
            component: () => import('@/views/pages/faq/Faq.vue')
        },
        {
            name: 'Banners',
            path: '/widgets/banners',
            component: () => import('@/views/widgets/banners/banners.vue')
        },
        {
            name: 'Cards',
            path: '/widgets/cards',
            component: () => import('@/views/widgets/cards/cards.vue')
        },
        {
            name: 'Charts',
            path: '/widgets/charts',
            component: () => import('@/views/widgets/charts/charts.vue')
        },
        {
            name: 'Autocomplete',
            path: '/forms/form-elements/autocomplete',
            component: () => import('@/views/forms/form-elements/VAutocomplete.vue')
        },
        {
            name: 'Combobox',
            path: '/forms/form-elements/combobox',
            component: () => import('@/views/forms/form-elements/Combobox.vue')
        },
        {
            name: 'File Inputs',
            path: '/forms/form-elements/fileinputs',
            component: () => import('@/views/forms/form-elements/FileInputs.vue')
        },
        {
            name: 'Custom Inputs',
            path: '/forms/form-elements/custominputs',
            component: () => import('@/views/forms/form-elements/CustomInputs.vue')
        },
        {
            name: 'Select',
            path: '/forms/form-elements/select',
            component: () => import('@/views/forms/form-elements/Select.vue')
        },
        {
            name: 'Button',
            path: '/forms/form-elements/button',
            component: () => import('@/views/forms/form-elements/VButtons.vue')
        },
        {
            name: 'Checkbox',
            path: '/forms/form-elements/checkbox',
            component: () => import('@/views/forms/form-elements/VCheckbox.vue')
        },
        {
            name: 'Radio',
            path: '/forms/form-elements/radio',
            component: () => import('@/views/forms/form-elements/VRadio.vue')
        },
        {
            name: 'Date Time',
            path: '/forms/form-elements/date-time',
            component: () => import('@/views/forms/form-elements/VDateTime.vue')
        },
        {
            name: 'Time Picker',
            path: '/forms/form-elements/time-picker',
            component: () => import('@/views/forms/form-elements/VTimePicker.vue')
        },

        {
            name: 'Stepper',
            path: '/forms/form-elements/stepper',
            component: () => import('@/views/forms/form-elements/VStepper.vue')
        },
        {
            name: 'Slider',
            path: '/forms/form-elements/slider',
            component: () => import('@/views/forms/form-elements/VSlider.vue')
        },
        {
            name: 'Switch',
            path: '/forms/form-elements/switch',
            component: () => import('@/views/forms/form-elements/VSwitch.vue')
        },
        {
            name: 'Form Layout',
            path: '/forms/form-layouts',
            component: () => import('@/views/forms/FormLayouts.vue')
        },
        {
            name: 'Form Horizontal',
            path: '/forms/form-horizontal',
            component: () => import('@/views/forms/FormHorizontal.vue')
        },
        {
            name: 'Form Vertical',
            path: '/forms/form-vertical',
            component: () => import('@/views/forms/FormVertical.vue')
        },
        {
            name: 'Form Custom',
            path: '/forms/form-custom',
            component: () => import('@/views/forms/FormCustom.vue')
        },
        {
            name: 'Form Validation',
            path: '/forms/form-validation',
            component: () => import('@/views/forms/FormValidation.vue')
        },
        {
            name: 'Editor',
            path: '/forms/editor',
            component: () => import('@/views/forms/plugins/editor/Editor.vue')
        },
        {
            name: 'Basic Table',
            path: '/tables/basic',
            component: () => import('@/views/tables/TableBasic.vue')
        },
        {
            name: 'Dark Table',
            path: '/tables/dark',
            component: () => import('@/views/tables/TableDark.vue')
        },
        {
            name: 'Density Table',
            path: '/tables/density',
            component: () => import('@/views/tables/TableDensity.vue')
        },
        {
            name: 'Fixed Header Table',
            path: '/tables/fixed-header',
            component: () => import('@/views/tables/TableHeaderFixed.vue')
        },
        {
            name: 'Height Table',
            path: '/tables/height',
            component: () => import('@/views/tables/TableHeight.vue')
        },
        {
            name: 'Editable Table',
            path: '/tables/editable',
            component: () => import('@/views/tables/TableEditable.vue')
        },
        {
            name: 'Basic Data Table',
            path: '/tables/datatables/basic',
            component: () => import('@/views/tables/datatables/BasicTable.vue')
        },
        {
            name: 'Header Data Table',
            path: '/tables/datatables/header',
            component: () => import('@/views/tables/datatables/HeaderTables.vue')
        },
        {
            name: 'Selection Data Table',
            path: '/tables/datatables/selection',
            component: () => import('@/views/tables/datatables/Selectable.vue')
        },
        {
            name: 'Sorting Data Table',
            path: '/tables/datatables/sorting',
            component: () => import('@/views/tables/datatables/SortingTable.vue')
        },
        {
            name: 'Pagination Data Table',
            path: '/tables/datatables/pagination',
            component: () => import('@/views/tables/datatables/Pagination.vue')
        },
        {
            name: 'Filtering Data Table',
            path: '/tables/datatables/filtering',
            component: () => import('@/views/tables/datatables/Filtering.vue')
        },
        {
            name: 'Grouping Data Table',
            path: '/tables/datatables/grouping',
            component: () => import('@/views/tables/datatables/Grouping.vue')
        },
        {
            name: 'Slots Data Table',
            path: '/tables/datatables/slots',
            component: () => import('@/views/tables/datatables/Slots.vue')
        },
        {
            name: 'CRUD Table',
            path: '/tables/datatables/crudtable',
            component: () => import('@/views/tables/datatables/CrudTable.vue')
        },
        {
            name: 'Alert',
            path: '/ui-components/alert',
            component: () => import('@/views/ui-elements/UiAlert.vue')
        },
        {
            name: 'Accordion',
            path: '/ui-components/accordion',
            component: () => import('@/views/ui-elements/UiExpansionPanel.vue')
        },
        {
            name: 'Avtar',
            path: '/ui-components/avatar',
            component: () => import('@/views/ui-elements/UiAvatar.vue')
        },
        {
            name: 'Chip',
            path: '/ui-components/chip',
            component: () => import('@/views/ui-elements/UiChip.vue')
        },
        {
            name: 'Dialog',
            path: '/ui-components/dialogs',
            component: () => import('@/views/ui-elements/UiDialog.vue')
        },
        {
            name: 'List',
            path: '/ui-components/list',
            component: () => import('@/views/ui-elements/UiList.vue')
        },
        {
            name: 'Menus',
            path: '/ui-components/menus',
            component: () => import('@/views/ui-elements/UiMenus.vue')
        },
        {
            name: 'Rating',
            path: '/ui-components/rating',
            component: () => import('@/views/ui-elements/UiRating.vue')
        },
        {
            name: 'Tabs',
            path: '/ui-components/tabs',
            component: () => import('@/views/ui-elements/UiTabs.vue')
        },
        {
            name: 'Tooltip',
            path: '/ui-components/tooltip',
            component: () => import('@/views/ui-elements/UiTooltip.vue')
        },
        {
            name: 'Typography',
            path: '/ui-components/typography',
            component: () => import('@/views/style-animation/Typography.vue')
        },
        {
            name: 'Gallery Lightbox',
            path: '/pages/gallery-lightbox',
            component: () => import('@/views/pages/Gallery-Lightbox/GalleryLightbox.vue')
        },
        {
            name: 'Pricing',
            path: '/pages/pricing',
            component: () => import('@/views/pages/pricing/Pricing.vue')
        },
        {
            name: 'Treeview',
            path: '/pages/treeview',
            component: () => import('@/views/pages/treeview/Treeview.vue')
        },
        {
            name: 'Search Results',
            path: '/pages/search-results',
            component: () => import('@/views/pages/search-results/SearchResults.vue')
        },
        {
            name: 'Social Media Contacts',
            path: '/pages/social-media-contacts',
            component: () => import('@/views/pages/social-media/SocialMedia.vue')
        },
        {
            name: 'Account Setting',
            path: '/pages/account-settings',
            component: () => import('@/views/pages/account-settings/AccountSettings.vue')
        },

        {
            name: 'FAQ',
            path: '/pages/faq',
            component: () => import('@/views/pages/faq/Faq.vue')
        },
        {
            name: 'Line',
            path: '/charts/line-chart',
            component: () => import('@/views/charts/ApexLineChart.vue')
        },
        {
            name: 'Area',
            path: '/charts/area-chart',
            component: () => import('@/views/charts/ApexAreaChart.vue')
        },
        {
            name: 'Gredient',
            path: '/charts/gredient-chart',
            component: () => import('@/views/charts/ApexGredientChart.vue')
        },
        {
            name: 'Column',
            path: '/charts/column-chart',
            component: () => import('@/views/charts/ApexColumnChart.vue')
        },
        {
            name: 'Candlestick',
            path: '/charts/candlestick-chart',
            component: () => import('@/views/charts/ApexCandlestickChart.vue')
        },
        {
            name: 'Donut & Pie',
            path: '/charts/doughnut-pie-chart',
            component: () => import('@/views/charts/ApexDonutPieChart.vue')
        },
        {
            name: 'Radialbar & Radar',
            path: '/charts/radialbar-chart',
            component: () => import('@/views/charts/ApexRadialRadarChart.vue')
        },
        {
            name: 'Tabler',
            path: '/icons/tabler',
            component: () => import('@/views/icons/TablerIcons.vue')
        },
        {
            name: 'Iconify',
            path: '/icons/solar',
            component: () => import('@/views/icons/IconifyIcons.vue')
        }
    ]
};

export default MainRoutes;
