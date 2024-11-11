export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    BgColor?: string;
    chipBgColor?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

const sidebarItem: menu[] = [
    {
        title: 'Home',
        icon: 'widget-add-line-duotone',
        to: '/dashboards/dashboard1'
    },
    {
        title: 'Users',
        icon: 'cart-3-line-duotone',
        to: '/users/',
        children: [
            {
                title: 'All Users',
                to: '/users/allUser'
            },
            {
                title: 'Add New User',
                to: '/users/addNewUser'
            },
            {
                title: 'Verified Users',
                to: '/users/verifiedUser'
            },
            {
                title: 'Unverified Users',
                to: '/users/unverifiedUser'
            },
            {
                title: 'Incomplete Users Registrations',
                to: '/users/incompleteRegistration'
            }
        ]
    },
    {
        title: 'Merchants',
        icon: 'cart-3-line-duotone',
        to: '/merchants/',
        children: [
            {
                title: 'All Merchants',
                to: '/merchants/allMerchant'
            },
            {
                title: 'Add New Merchant',
                to: '/merchants/addNewMerchant'
            },
            {
                title: 'Verified Merchants',
                to: '/merchants/verifiedMerchant'
            },
            {
                title: 'Unverified Merchants',
                to: '/merchants/unverifiedMerchant'
            },
            {
                title: 'Incomplete Merchant Registrations',
                to: '/merchants/incompleteRegistrationMerchant'
            },
            {
                title: 'Merchant Sub-Accounts',
                to: '/merchants/subAccounts'
            }
        ]
    },
    {
        title: 'Agents',
        icon: 'cart-3-line-duotone',
        to: '/agents/',
        children: [
            {
                title: 'All Agents',
                to: '/agents/allAgent'
            },
            {
                title: 'Add New Agent',
                to: '/agents/addNewAgent'
            },
            {
                title: 'Verified Agents',
                to: '/agents/verifiedAgent'
            },
            {
                title: 'Unverified Agents',
                to: '/agents/unverifiedAgent'
            },
            {
                title: 'Incomplete Agents Registrations',
                to: '/agents/incompleteAgentRegistration'
            }
        ]
    },
    {
        title: 'Admins',
        icon: 'cart-3-line-duotone',
        to: '/admin/',
        children: [
            {
                title: 'All Admins',
                to: '/admins/allAdmin'
            }
            // {
            //     title: 'Add New Admin',
            //     to: '/admins/addNewAdmin'
            // }
        ]
    },
    {
        title: 'Billers',
        icon: 'cart-3-line-duotone',
        to: '/billers/',
        children: [
            {
                title: 'All Billers',
                to: '/billers/allBiller'
            },
            {
                title: 'Biller Services',
                to: '/billers/billerService'
            },
            {
                title: 'Biller Reports',
                to: '/billers/billerReport'
            },
            {
                title: 'Biller Funds Withdrawal',
                to: '/billers/billerWithdrawalFund'
            }
        ]
    },
    {
        title: 'Reports',
        icon: 'cart-3-line-duotone',
        to: '/reports/',
        children: [
            {
                title: 'Fund Requests',
                to: '/reports/fundRequest'
            },
            {
                title: 'Admin Wallet History',
                to: '/reports/adminWalletHistory'
            },
            {
                title: 'Master Wallet History',
                to: '/reports/masterWalletHistory'
            },
            {
                title: 'Withdrawal',
                to: '/reports/withdrawals'
            },

            {
                title: 'Deposit',
                to: '/reports/deposit'
            },
            {
                title: 'Export All Users',
                to: '/ecommerce/checkout'
            }
        ]
    },
    {
        title: 'Rewards',
        icon: 'cart-3-line-duotone',
        to: '/rewards/',
        children: [
            {
                title: 'Create Offer',
                to: '/rewards/createOffer'
            },
            {
                title: 'All Vouchers',
                to: '/rewards/allVouchers'
            },
            {
                title: 'Reedemed Vouchers',
                to: '/rewards/reedemedVouchers'
            }
        ]
    },
    {
        title: 'Ticket',
        icon: 'cart-3-line-duotone',
        to: '/tickets/',
        children: [
            {
                title: 'Ticket Type',
                to: '/tickets/ticketType'
            },
            {
                title: 'Ticket List',
                to: '/tickets/ticketList'
            }
        ]
    },
    {
        title: 'App Grid',
        icon: 'widget-add-line-duotone',
        to: '/appGrid'
    },
    {
        title: 'Settings',
        icon: 'cart-3-line-duotone',
        to: '/settings/',
        children: [
            {
                title: 'User Activity',
                to: '/settings/userActivity'
            },
            {
                title: 'Schemes',
                to: '/settings/schemes'
            },
            {
                title: 'FAQ',
                to: '/settings/fequentAskedQuestions'
            },
            {
                title: 'Payment Charge Package',
                to: '/settings/paymentChargePackage'
            },
            {
                title: 'System Settings',
                to: '/settings/systemSettings'
            },
            {
                title: 'Notification',
                to: '/settings/notification'
            }
        ]
    },
    {
        title: 'Advertisement',
        icon: 'widget-add-line-duotone',
        to: '/advertisement'
    },
    {
        title: 'Bank Withdrawal',
        icon: 'cart-3-line-duotone',
        to: '/ecommerce/',
        children: [
            {
                title: 'System Banks',
                to: '/systemBank'
            }
        ]
    },

    { header: 'UI' },
    {
        title: 'UI Elements',
        icon: 'waterdrops-line-duotone',
        to: '#',
        children: [
            {
                title: 'Alert',
                to: '/ui-components/alert'
            },
            {
                title: 'Accordion',
                to: '/ui-components/accordion'
            },
            {
                title: 'Avatar',
                to: '/ui-components/avatar'
            },
            {
                title: 'Chip',
                to: '/ui-components/chip'
            },
            {
                title: 'Dialog',
                to: '/ui-components/dialogs'
            },
            {
                title: 'List',
                to: '/ui-components/list'
            },
            {
                title: 'Menus',
                to: '/ui-components/menus'
            },
            {
                title: 'Rating',
                to: '/ui-components/rating'
            },
            {
                title: 'Tabs',
                to: '/ui-components/tabs'
            },
            {
                title: 'Tooltip',
                to: '/ui-components/tooltip'
            },
            {
                title: 'Typography',
                to: '/ui-components/typography'
            }
        ]
    },

    { header: 'Forms' },
    {
        title: 'Form Elements',
        icon: 'text-selection-line-duotone',
        to: '/components/',
        children: [
            {
                title: 'Autocomplete',
                to: '/forms/form-elements/autocomplete'
            },
            {
                title: 'Combobox',
                to: '/forms/form-elements/combobox'
            },
            {
                title: 'Button',
                to: '/forms/form-elements/button'
            },
            {
                title: 'Checkbox',
                to: '/forms/form-elements/checkbox'
            },
            {
                title: 'Custom Inputs',
                to: '/forms/form-elements/custominputs'
            },
            {
                title: 'File Inputs',
                to: '/forms/form-elements/fileinputs'
            },
            {
                title: 'Radio',
                to: '/forms/form-elements/radio'
            },
            {
                title: 'Date Time',
                to: '/forms/form-elements/date-time'
            },
            {
                title: 'Select',
                to: '/forms/form-elements/select'
            },
            {
                title: 'Slider',
                to: '/forms/form-elements/slider'
            },
            {
                title: 'Switch',
                to: '/forms/form-elements/switch'
            },
            {
                title: 'Time Picker',
                to: '/forms/form-elements/time-picker'
            },
            {
                title: 'Stepper',
                to: '/forms/form-elements/stepper'
            }
        ]
    },
    {
        title: 'Form Layout',
        icon: 'layers-minimalistic-outline',
        to: '/forms/form-layouts'
    },
    {
        title: 'Form Horizontal',
        icon: 'password-minimalistic-input-line-duotone',
        to: '/forms/form-horizontal'
    },
    {
        title: 'Form Vertical',
        icon: 'slider-vertical-line-duotone',
        to: '/forms/form-vertical'
    },
    {
        title: 'Form Custom',
        icon: 'clapperboard-play-outline',
        to: '/forms/form-custom'
    },
    {
        title: 'Form Validation',
        icon: 'soundwave-square-line-duotone',
        to: '/forms/form-validation'
    },
    {
        title: 'Editor',
        icon: 'clapperboard-edit-line-duotone',
        to: '/forms/editor'
    },

    { header: 'Tables' },
    {
        title: 'Basic Table',
        icon: 'tablet-line-duotone',
        to: '/tables/basic'
    },
    {
        title: 'Dark Table',
        icon: 'bedside-table-4-outline',
        to: '/tables/dark'
    },
    {
        title: 'Density Table',
        icon: 'bedside-table-3-linear',
        to: '/tables/density'
    },
    {
        title: 'Fixed Header Table',
        icon: 'archive-up-minimlistic-broken',
        to: '/tables/fixed-header'
    },
    {
        title: 'Height Table',
        icon: 'archive-down-minimlistic-broken',
        to: '/tables/height'
    },
    {
        title: 'Editable Table',
        icon: 'document-add-linear',
        to: '/tables/editable'
    },

    { header: 'Data Tables' },
    {
        title: 'Basic Table',
        icon: 'database-outline',
        to: '/tables/datatables/basic'
    },
    {
        title: 'Header Table',
        icon: 'folder-open-broken',
        to: '/tables/datatables/header'
    },
    {
        title: 'Selection Table',
        icon: 'chart-square-broken',
        to: '/tables/datatables/selection'
    },
    {
        title: 'Sorting Table',
        icon: 'card-send-line-duotone',
        to: '/tables/datatables/sorting'
    },
    {
        title: 'Pagination Table',
        icon: 'tag-horizontal-broken',
        to: '/tables/datatables/pagination'
    },
    {
        title: 'Filtering Table',
        icon: 'tuning-square-2-line-duotone',
        to: '/tables/datatables/filtering'
    },
    {
        title: 'Grouping Table',
        icon: 'tuning-square-2-line-duotone',
        to: '/tables/datatables/grouping'
    },
    {
        title: 'Table Slots',
        icon: 'closet-line-duotone',
        to: '/tables/datatables/slots'
    },
    {
        title: 'CRUD Table',
        icon: 'text-underline-cross-broken',
        to: '/tables/datatables/crudtable'
    },

    { header: 'Charts' },
    {
        title: 'Line',
        icon: 'chat-square-2-outline',
        to: '/charts/line-chart'
    },
    {
        title: 'Gredient',
        icon: 'round-graph-linear',
        to: '/charts/gredient-chart'
    },
    {
        title: 'Area',
        icon: 'graph-up-linear',
        to: '/charts/area-chart'
    },
    {
        title: 'Candlestick',
        icon: 'chandelier-broken',
        to: '/charts/candlestick-chart'
    },
    {
        title: 'Column',
        icon: 'colour-tuneing-broken',
        to: '/charts/column-chart'
    },
    {
        title: 'Doughnut & Pie',
        icon: 'pie-chart-2-linear',
        to: '/charts/doughnut-pie-chart'
    },
    {
        title: 'Radialbar & Radar',
        icon: 'radar-2-outline',
        to: '/charts/radialbar-chart'
    },

    { header: 'Auth' },
    {
        title: 'Error',
        icon: 'bug-minimalistic-line-duotone',
        to: '/auth/404'
    },
    {
        title: 'Side Login',
        icon: 'login-3-line-duotone',
        to: '/auth/login'
    },
    {
        title: 'Boxed Login',
        icon: 'login-3-line-duotone',
        to: '/auth/login2'
    },
    {
        title: 'Side Register',
        icon: 'user-plus-rounded-line-duotone',
        to: '/auth/register'
    },
    {
        title: 'Boxed Register',
        icon: 'user-plus-rounded-line-duotone',
        to: '/auth/register2'
    },
    {
        title: 'Side Forgot Pwd',
        icon: 'password-outline',
        to: '/auth/forgot-password'
    },
    {
        title: 'Boxed Forgot Pwd',
        icon: 'password-outline',
        to: '/auth/forgot-password2'
    },
    {
        title: 'Side Two Steps',
        icon: 'siderbar-line-duotone',
        to: '/auth/two-step'
    },
    {
        title: 'Boxed Two Steps',
        icon: 'siderbar-line-duotone',
        to: '/auth/two-step2'
    },
    {
        title: 'Maintenance',
        icon: 'settings-line-duotone',
        to: '/auth/maintenance'
    },

    { header: 'ICONS' },
    {
        title: 'Tabler Icons',
        icon: 'sticker-smile-circle-2-line-duotone',
        to: '/icons/tabler'
    },
    {
        title: 'Solar Icons',
        icon: 'sticker-smile-circle-2-line-duotone',
        to: '/icons/solar'
    },

    { header: 'MULTI LEVEL' },
    {
        title: 'Menu Level',
        icon: 'align-left-line-duotone',
        to: '#',
        children: [
            {
                title: 'Level 1',
                to: '/level1'
            },
            {
                title: 'Level 1 ',
                to: '/2level',
                children: [
                    {
                        title: 'Level 2',
                        to: '/barry'
                    },
                    {
                        title: 'Level 2',
                        to: '/2.2level',
                        children: [
                            {
                                title: 'Level 3',
                                to: '/barry'
                            }
                        ]
                    }
                ]
            }
        ]
    },

    { header: 'MORE OPTIONS' },
    {
        title: 'Applications',
        icon: 'check-circle-bold',
        BgColor: 'primary'
    },
    {
        title: 'Form Options',
        icon: 'check-circle-bold',
        BgColor: 'secondary'
    },
    {
        title: 'Table Variations',
        icon: 'check-circle-bold',
        BgColor: 'error'
    },
    {
        title: 'Charts Selection',
        icon: 'check-circle-bold',
        BgColor: 'warning'
    },
    {
        title: 'Widgets',
        icon: 'check-circle-bold',
        BgColor: 'success'
    }
];

export default sidebarItem;
