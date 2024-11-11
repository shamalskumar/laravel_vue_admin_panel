import type { RevenueProjects, Performance } from '@/types/components/dashboard/dashboard1';

import product1 from '@/assets/images/products/dash-prd-1.jpg';
import product2 from '@/assets/images/products/dash-prd-2.jpg';
import product3 from '@/assets/images/products/dash-prd-3.jpg';
import product4 from '@/assets/images/products/dash-prd-4.jpg';
import product5 from '@/assets/images/products/dash-prd-1.jpg';
import product6 from '@/assets/images/products/dash-prd-2.jpg';
import product7 from '@/assets/images/products/dash-prd-3.jpg';
import product8 from '@/assets/images/products/dash-prd-4.jpg';
import product9 from '@/assets/images/products/dash-prd-4.jpg';
import product10 from '@/assets/images/products/dash-prd-4.jpg';
import product11 from '@/assets/images/products/dash-prd-4.jpg';

/*--Revenue Projects --*/
const RevenueProjectsData: RevenueProjects[] = [
    {
        img: product1,
        username: 'user1',
        designation: 'Jason Roy',
        projectname: '73.2%',
        statuscolor: 'success',
        statustext: 'Medium',
        money: '$3.5K',
        userID: '1120',
        name: 'Raju Shri',
        amount: '$200.00',
        status: 'Completed',
        transactionNo: '124565756436',
        mobileNo: '+679 1234567',
        userType: 'Customer',
        gender: 'Male',
        email: 'user1@email.com',
        city: 'Nadi'
    },
    {
        img: product2,
        username: 'user2',
        designation: 'Mathew Flintoff',
        projectname: '73.2%',
        statuscolor: 'success',
        statustext: 'Very High',
        money: '$24.5K',
        userID: '1121',
        name: 'Ashni Kumar',
        amount: '$400.00',
        status: 'Completed',
        transactionNo: '124565756436',
        mobileNo: '+679 1234567',
        userType: 'Merchant',
        gender: 'Female',
        email: 'user2@email.com',
        city: 'Suva'
    },
    {
        img: product3,
        username: 'user3',
        designation: 'Anil Kumar',
        projectname: '73.2%',
        statuscolor: 'error',
        statustext: 'Low',
        money: '$12.8K',
        userID: '1122',
        name: 'Babu Rao',
        amount: '$10.00',
        status: 'Requested',
        transactionNo: '124565756436',
        mobileNo: '+679 1234567',
        userType: 'Admin',
        gender: 'Male',
        email: 'user3@email.com',
        city: 'Lautoka'
    },
    {
        img: product4,
        username: 'user4',
        designation: 'George Cruize',
        projectname: '73.2%',
        statuscolor: 'success',
        statustext: 'High',
        money: '$2.4K',
        userID: '1123',
        name: 'Ghani Shami',
        amount: '$50.00',
        status: 'Completed',
        transactionNo: '124565756436',
        mobileNo: '+679 1234567',
        userType: 'Customer',
        gender: 'Female',
        email: 'user4@email.com',
        city: 'Nadi'
    },
    {
        img: product5,
        username: 'user5',
        designation: 'Jason Roy',
        projectname: '73.2%',
        statuscolor: 'error',
        statustext: 'Medium',
        money: '$3.5K',
        userID: '1124',
        name: 'Rati Mari',
        amount: '$250.00',
        status: 'Requested',
        transactionNo: '124565756436',
        mobileNo: '+679 1234567',
        userType: 'Merchant',
        gender: 'Female',
        email: 'user5@email.com',
        city: 'Suva'
    },
    {
        img: product6,
        username: 'user6',
        designation: 'Mathew Flintoff',
        projectname: '73.2%',
        statuscolor: 'error',
        statustext: 'Very High',
        money: '$24.5K',
        userID: '1125',
        name: 'Rohit Shetty',
        amount: '$20.00',
        status: 'Requested',
        transactionNo: '124565756436',
        mobileNo: '+679 1234567',
        userType: 'Customer',
        gender: 'Male',
        email: 'user6@email.com',
        city: 'Ba'
    },
    {
        img: product7,
        username: 'user7',
        designation: 'Anil Kumar',
        projectname: '73.2%',
        statuscolor: 'error',
        statustext: 'Low',
        money: '$12.8K',
        userID: '1126',
        name: 'Johnny Lever',
        amount: '$120.00',
        status: 'Requested',
        transactionNo: '124565756436',
        mobileNo: '+679 1234567',
        userType: 'Customer',
        gender: 'Male',
        email: 'user7@email.com',
        city: 'Suva'
    },
    {
        img: product8,
        username: 'user8',
        designation: 'George Cruize',
        projectname: '73.2%',
        statuscolor: 'success',
        statustext: 'High',
        money: '$2.4K',
        userID: '1127',
        name: 'George Cruize',
        amount: '$100.00',
        status: 'Completed',
        transactionNo: '124565756436',
        mobileNo: '+679 1234567',
        userType: 'Customer',
        gender: 'Male',
        email: 'user8@email.com',
        city: 'Nadi'
    },
    {
        img: product9,
        username: 'user9',
        designation: 'George Cruize',
        projectname: '73.2%',
        statuscolor: 'success',
        statustext: 'High',
        money: '$2.4K',
        userID: '1127',
        name: 'Micheal Bourne',
        amount: '$100.00',
        status: 'Completed',
        transactionNo: '124565756436',
        mobileNo: '+679 1234567',
        userType: 'Customer',
        gender: 'Female',
        email: 'user9@email.com',
        city: 'Lautoka'
    },
    {
        img: product10,
        username: 'user10',
        designation: 'George Cruize',
        projectname: '73.2%',
        statuscolor: 'success',
        statustext: 'High',
        money: '$2.4K',
        userID: '1127',
        name: 'Jason Statham',
        amount: '$100.00',
        status: 'Completed',
        transactionNo: '124565756436',
        mobileNo: '+679 1234567',
        userType: 'Customer',
        gender: 'Male',
        email: 'user10@email.com',
        city: 'Suva'
    },
    {
        img: product11,
        username: 'user11',
        designation: 'George Cruize',
        projectname: '73.2%',
        statuscolor: 'success',
        statustext: 'High',
        money: '$2.4K',
        userID: '1127',
        name: 'Georgia Martini',
        amount: '$100.00',
        status: 'Completed',
        transactionNo: '124565756436',
        mobileNo: '+679 1234567',
        userType: 'Customer',
        gender: 'Female',
        email: 'user11@email.com',
        city: 'Nadi'
    }
];

/*--Performance--*/
const PerformanceData: Performance[] = [
    {
        icon: 'shop-2-linear',
        title: '64 new orders',
        subtitle: 'Processing',
        color: 'primary'
    },
    {
        icon: 'filters-outline',
        title: '4 orders',
        subtitle: 'On hold',
        color: 'error'
    },
    {
        icon: 'pills-3-linear',
        title: '6 orders',
        subtitle: 'Delivered',
        color: 'secondary'
    }
];

export { RevenueProjectsData, PerformanceData };
