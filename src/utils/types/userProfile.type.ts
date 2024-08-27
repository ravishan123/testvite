export type UserProfile = {
  sub?: string;
  user_id?: string;
  first_name?: string;
  last_name?: string;
  gender?: string | undefined;
  date_of_birth?: Date;
  joined_date?: Date | null;
  email?: string;
  city?: string | null;
  country?: string | null;
  about_me?: string | null;
  phone?: string | null;
};

export type UserProfileComplete = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  gender: Uppercase<'male' | 'female'> | string;
  phone: string;
  profile_image: string;
  about_me: string;
  email_verified: boolean;
  phone_verified: boolean;
  status: string;
  joined_date: Date;
  auth_provider: string;
  city: string;
  country: string;
  countryName: string;
  created_at: Date;
  updated_at: Date;
};

export type HomePageStats = {
  data: {
    joinedLastWeek: string;
    totalOrganizations: string;
    totalVerifiedHours: string;
  };
};
