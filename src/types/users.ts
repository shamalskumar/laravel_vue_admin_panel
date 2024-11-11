// User Profile Type
type UserModel = {
    id: number;
    fullName: string;
    email: string;
    mobileNo: string;
    mobileCountryCode: string;
    dateOfBirth: string;
    gender: string;
    profilePicImgUrl: string;
    address: string;
    city: {
        id: number;
        cityName: string;
        countryId: number;
    };
    cityId: number;
    isKycVerified: boolean;
    kycDocumentId: string;
    kycDocumentType: string;
    kycDocumentUrl: string;
    kycDocumentExpiryDate: string;
    kycVerifiedAt: string;
    kycVerifiedBy: number;
    wallet: {
        balance: string;
        blockedBalance: string;
        limit: string;
    };
    userType: string;
    paymentLink: string;
    qrCodeInfo: string;
    createdAt: string;
    updatedAt: string;
    accountBlocked: boolean;
    hasSubAccounts: boolean;
    isRegistrationCompleted: boolean;
    isSubAccount: boolean;
    isVerified: boolean;
    agent: {
        id: number;
        userId: number;
        createdAt: string;
        updatedAt: string;
        commissionSchemeId: number;
    } | null; // Assuming agent could be null
};

export type { UserModel };
