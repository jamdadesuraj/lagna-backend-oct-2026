// profileApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'
// ---------- Nested Types ----------
export interface BasicDetails {
  profileFor: string
  gender: string
  firstName: string
  lastName: string
  dob: string
  age: number
  height: string
  maritalStatus: string
}

export interface EducationDetails {
  highestQualification: string
  educationType: string
  occupation: string
  annualIncome: string
}

export interface ReligionDetails {
  religion: string
  caste: string
  subCaste: string
  hasDosh: boolean
  motherTongue: string
}

export interface LocationDetails {
  country: string
  state: string
  city: string
  countryCode?: string
  stateCode?: string
}

export interface BirthTime {
  hour: number
  minute: number
  meridiem: string
}

export interface StarDetails {
  nakshatra: string
  rashi: string
}

export interface HoroscopeDetails {
  birthTime: BirthTime
  birthPlace: LocationDetails
  starDetails: StarDetails
}

export interface LifestyleDetailsBasic {
  eatingHabit: string
}

export interface AboutMe {
  about: string
  describeYourself: string
  profileCreatedBy: string
  languagesISpeak: string[]
  disability: string
  thalassemia: string
  hivStatus: boolean
}

export interface CareerDetails {
  employedIn: string
  occupation: string
  organizationName: string
  interestedInSettlingAbroad: boolean
}

export interface Education {
  aboutEducation: string
  highestDegree: string
  postGraduation: string
  underGraduation: string
  school: string
}

export interface Family {
  aboutFamily: string
  fatherOccupation: string
  motherOccupation: string
  brothers: string
  sisters: string
  familyIncome: string
  familyStatus: string
  familyType: string
  familyValue: string
  livingWithParents: boolean
  familyBasedOutOf: string
}

export interface ContactDetails {
  email: string
  alternateEmail: string
  phoneNumber: string
  alternatePhoneNumber: string
  landlineNumber: string
  relationshipWithBrideOrGroom: string
}

export interface Lifestyle {
  dietaryHabit: string
  drinkingHabit: string
  smokingHabit: string
  openToPets: boolean
  ownHouse: boolean
  ownCar: boolean
  foodICook: string
  hobbies: string[]
  favouriteMusic: string[]
  favouriteBooks: string[]
  dressStyle: string
  sports: string[]
  cuisine: string[]
  movies: string[]
  favouriteRead: string[]
  tvShow: string[]
}

export interface Subscription {
  isActive: boolean
}

// ---------- Main Profile Type ----------
export interface Profile {
  _id: string
  userId: string
  matrimonyId: string
  basicDetails: BasicDetails
  educationDetails: EducationDetails
  religionDetails: ReligionDetails
  locationDetails: LocationDetails
  horoscopeDetails: HoroscopeDetails
  lifestyleDetails: LifestyleDetailsBasic
  aboutMe: AboutMe
  photos: string[]
  careerDetails: CareerDetails
  education: Education
  family: Family
  contactDetails: ContactDetails
  lifestyle: Lifestyle
  subscription: Subscription
  isVerified: boolean
  isBlocked: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

// Payload for create/update — same shape minus server-managed fields
export type ProfilePayload = Omit<
  Profile,
  '_id' | 'matrimonyId' | 'subscription' | 'isVerified' | 'isBlocked' | 'isDeleted' | 'createdAt' | 'updatedAt' | '__v'
>

export interface ProfileResponse {
  success: boolean
  message?: string
  data: Profile
}

// ---------- Pagination meta returned by backend ----------
export interface ProfilePagination {
  currentPage: number
  limit: number
  totalProfiles: number
  totalPages: number
}

export interface ProfileListResponse {
  success: boolean
  message?: string
  data: Profile[]
  pagination: ProfilePagination
}

// ---------- Query args for getProfiles ----------
export interface GetProfilesParams {
  page: number
  limit: number
}

// ---------- Base URL ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    addProfile: builder.mutation<ProfileResponse, FormData>({
      query: (formData) => ({
        url: '/admin/profile',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Profile'],
    }),

    getProfiles: builder.query<ProfileListResponse, GetProfilesParams>({
      query: ({ page, limit }) => ({
        url: '/admin/profile',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Profile'],
    }),

    getProfileById: builder.query<ProfileResponse, string>({
      query: (id) => ({
        url: `/admin/profile/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Profile', id }],
    }),

    updateProfile: builder.mutation<ProfileResponse, { id: string; body: Partial<ProfilePayload> }>({
      query: ({ id, body }) => ({
        url: `/admin/profile/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Profile', id }, 'Profile'],
    }),

    deleteProfile: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/admin/profile/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
})

export const { useAddProfileMutation, useGetProfilesQuery, useGetProfileByIdQuery, useUpdateProfileMutation, useDeleteProfileMutation } = profileApi
