export namespace ComponentTypeId {
  export const Login = 1n;
  export const GameCard = 2n;
  export const Toasty = 3n;
  export const Notifications = 4n;
  export const BetAmountInput = 5n;
  export const Layout = 6n;
  export const Tabs = 7n;
  export const ProfileRankCards = 8n;
  export const UserProfileChip = 9n;
  export const TournamentCard = 10n;
  export const VipClubCards = 11n;
  export const MainBanners = 12n;
  export const RewardCard = 13n;
  export const RewardIcon = 14n;
  export const GameCountdown = 15n;
  export const GameVictoryBanner = 16n;
  export const VipClubOverview = 17n;
  export const VipClubModalHeader = 18n;
  export const VipPerkCard = 19n;
  export const VipPerks = 20n;
  export const VipPrioritySupport = 21n;
  export const AffiliatesPanelHero = 22n;
  export const AffiliatesCard = 23n;
  export const BonusHero = 24n;
  export const Modal = 25n;
  export const RankProgress = 26n;
  export const Stories = 27n;
  export const CreateReferralVoucherModal = 28n;
  export const ReferralVoucherForm = 29n;
  export const WithdrawReferralComissionsModal = 30n;
  export const WithdrawReferralComissionsHero = 31n;
  export const BalanceButton = 32n;
  export const Navbar = 33n;
  export const UserProfile = 34n;
  export const HomeHero = 35n;
  export const Sidebar = 36n;
  export const Accounts = 37n;
  export const AffiliatesOffilineHeader = 38n;
}

export type ComponentType =
  (typeof ComponentTypeId)[keyof typeof ComponentTypeId];
