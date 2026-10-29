// app/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './authApi'
import { motherTongueApi } from './motherToungeApi'
import { qualificationApi } from './qualificationApi'
import { religionApi } from './religionApi'
import { casteApi } from './casteApi'
import { subCasteApi } from './subCasteApi'
import { packageApi } from './packageApi'
import { faqApi } from './faqAPi'
import { heightApi } from './heightApi'
import { annualIncomeApi } from './annualIncomeApi'
import { occupationApi } from './occupationApi'
import { privacyPolicyApi } from './privacy-policyApi'
import { contactUsApi } from './contact-usApi'
import { profileApi } from './profilesApi'
import { profile } from 'console'
import { profileVerificationApi } from './profileVerificationApi'
import { termsConditionsApi } from './termsApi'
import { heroBannerApi } from './heroBanerApi'
import { counterApi } from './counterApi'
import { helpCenterApi } from './helpCentreApi'
import { reportProfileApi } from './reportProfileApi'
import { appReviewApi } from './appReviewApi'
import { onboardingApi } from './onboardingApi'
import { onlinePersonalTipsApi } from './onlinePersonalTipsApi'
import { successStoryApi } from './successStoryApi'
import { downloadApkApi } from './downloadApkApi'
import { aboutUsApi } from './manage-about-usApi'
import { careersApi } from './careersApi'
import { blogApi } from './blogApi'
import { fraudAlertApi } from './fraudAlertApi'
import { appSettingsApi } from './appSettingsApi'
import { webSettingsApi } from './webSettingsApi'
import { generalSettingsApi } from './generalSettingsApi'
import { biodataTemplateApi } from './biodataTemplateApi'
import { paymentStatsApi } from './paymentsApi'
import { adminNotificationApi } from './adminNotificationApi'
import { dashboardApi } from './dashboardApi'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [motherTongueApi.reducerPath]: motherTongueApi.reducer,
    [qualificationApi.reducerPath]: qualificationApi.reducer,
    [religionApi.reducerPath]: religionApi.reducer,
    [casteApi.reducerPath]: casteApi.reducer,
    [subCasteApi.reducerPath]: subCasteApi.reducer,
    [packageApi.reducerPath]: packageApi.reducer,
    [faqApi.reducerPath]: faqApi.reducer,
    [heightApi.reducerPath]: heightApi.reducer,
    [annualIncomeApi.reducerPath]: annualIncomeApi.reducer,
    [occupationApi.reducerPath]: occupationApi.reducer,
    [privacyPolicyApi.reducerPath]: privacyPolicyApi.reducer,
    [contactUsApi.reducerPath]: contactUsApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [profileVerificationApi.reducerPath]: profileVerificationApi.reducer,
    [termsConditionsApi.reducerPath]: termsConditionsApi.reducer,
    [heroBannerApi.reducerPath]: heroBannerApi.reducer,
    [counterApi.reducerPath]: counterApi.reducer,
    [helpCenterApi.reducerPath]: helpCenterApi.reducer,
    [reportProfileApi.reducerPath]: reportProfileApi.reducer,
    [appReviewApi.reducerPath]: appReviewApi.reducer,
    [onboardingApi.reducerPath]: onboardingApi.reducer,
    [onlinePersonalTipsApi.reducerPath]: onlinePersonalTipsApi.reducer,
    [successStoryApi.reducerPath]: successStoryApi.reducer,
    [downloadApkApi.reducerPath]: downloadApkApi.reducer,
    [aboutUsApi.reducerPath]: aboutUsApi.reducer,
    [careersApi.reducerPath]: careersApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [fraudAlertApi.reducerPath]: fraudAlertApi.reducer,
    [appSettingsApi.reducerPath]: appSettingsApi.reducer,
    [webSettingsApi.reducerPath]: webSettingsApi.reducer,
    [generalSettingsApi.reducerPath]: generalSettingsApi.reducer,
    [biodataTemplateApi.reducerPath]: biodataTemplateApi.reducer,
    [paymentStatsApi.reducerPath]: paymentStatsApi.reducer,
    [adminNotificationApi.reducerPath]: adminNotificationApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      motherTongueApi.middleware,
      qualificationApi.middleware,
      religionApi.middleware,
      casteApi.middleware,
      subCasteApi.middleware,
      packageApi.middleware,
      faqApi.middleware,
      heightApi.middleware,
      annualIncomeApi.middleware,
      occupationApi.middleware,
      privacyPolicyApi.middleware,
      contactUsApi.middleware,
      profileApi.middleware,
      profileVerificationApi.middleware,
      termsConditionsApi.middleware,
      heroBannerApi.middleware,
      counterApi.middleware,
      helpCenterApi.middleware,
      reportProfileApi.middleware,
      appReviewApi.middleware,
      onboardingApi.middleware,
      onlinePersonalTipsApi.middleware,
      successStoryApi.middleware,
      downloadApkApi.middleware,
      aboutUsApi.middleware,
      careersApi.middleware,
      blogApi.middleware,
      fraudAlertApi.middleware,
      appSettingsApi.middleware,
      webSettingsApi.middleware,
      generalSettingsApi.middleware,
      biodataTemplateApi.middleware,
      paymentStatsApi.middleware,
      adminNotificationApi.middleware,
      dashboardApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
