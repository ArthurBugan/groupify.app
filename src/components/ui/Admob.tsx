import React, { useEffect } from 'react';
import { View, Platform } from 'react-native';
import { 
  MobileAds, 
  BannerAd, 
  BannerAdSize, 
  InterstitialAd, 
  AdEventType,
  TestIds,
  RewardedAd,
  RewardedAdEventType,
  AppOpenAd
} from 'react-native-google-mobile-ads';

// Configure Ad Units
const BANNER_AD_UNIT_ID = __DEV__ 
  ? TestIds.BANNER 
  : Platform.select({
      ios: 'ca-app-pub-4077364511521347/3341690262',
      android: 'ca-app-pub-4077364511521347/5028289954'
    });

const INTERSTITIAL_AD_UNIT_ID = __DEV__ 
  ? TestIds.INTERSTITIAL 
  : Platform.select({
      ios: 'ca-app-pub-4077364511521347/3341690262',
      android: 'ca-app-pub-4077364511521347/5028289954'
    });

const REWARDED_AD_UNIT_ID = __DEV__ 
  ? TestIds.REWARDED 
  : Platform.select({
      ios: 'ca-app-pub-4077364511521347/3341690262',
      android: 'ca-app-pub-4077364511521347/5028289954'
    });

const APP_OPEN_AD_UNIT_ID = __DEV__ 
  ? TestIds.APP_OPEN 
  : Platform.select({
      ios: 'ca-app-pub-4077364511521347/3341690262',
      android: 'ca-app-pub-4077364511521347/5028289954'
    });


export const openAppAd = () => {
  return new Promise((resolve, reject) => {
    const appOpenAd = AppOpenAd.createForAdRequest(APP_OPEN_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      appOpenAd.show();
    });

    appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
      resolve(true);
    });

    appOpenAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('App open ad error', error);
      resolve(false); // Resolve false so the app can continue
    });

    // Begin loading
    appOpenAd.load();
  });
};

// Rewarded Ad Management
export const loadRewardedAd = () => {
  return new Promise((resolve, reject) => {
    const rewarded = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      rewarded.show();
    });

    rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => {
      console.log('User earned reward of ', reward);
      // Handle user reward
    });

    rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      resolve(true);
    });

    rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('Rewarded ad error', error);
      resolve(false); // Resolve false so the app can continue
    });

    // Begin loading
    rewarded.load();
  });
};

// Interstitial Ad Management
export const loadInterstitial = () => {
  return new Promise((resolve) => {
    const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    interstitial.addAdEventListener(AdEventType.LOADED, () => {
      interstitial.show();
    });

    interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      resolve(true);
    });

    interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('Interstitial ad error', error);
      resolve(false);
    });

    // Begin loading
    interstitial.load();
  });
};

const AdMobManager = ({ style }) => {
  useEffect(() => {
    // Initialize MobileAds
    MobileAds()
      .initialize()
      .then(adapterStatuses => {
        // Initialization complete
        console.log('AdMob Initialization complete', adapterStatuses);
      });
  }, []);

  // Banner Ad Component
  const BannerAdComponent = () => (
    <BannerAd
      unitId={BANNER_AD_UNIT_ID}
      size={BannerAdSize.FULL_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
      onAdLoaded={() => {
        console.log('Banner ad loaded');
      }}
      onAdFailedToLoad={(error) => {
        console.error('Banner ad failed to load', error);
      }}
    />
  );

  return (
    <View style={[{ alignItems: 'center' }, style]}>
      <BannerAdComponent />
    </View>
  );
};

export const InlineAd = ({ style }: { style?: any }) => (
  <View style={[{ alignItems: 'center', marginVertical: 10 }, style]}>
    <BannerAd
      unitId={BANNER_AD_UNIT_ID}
      size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  </View>
);

// Attach methods to AdMobManager for easier access
AdMobManager.loadRewardedAd = loadRewardedAd;
AdMobManager.loadInterstitial = loadInterstitial;
AdMobManager.openAppAd = openAppAd;

export default AdMobManager;