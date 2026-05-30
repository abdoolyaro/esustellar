import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const HAPTICS_ENABLED_STORAGE_KEY = 'esustellar_haptics_enabled';

let cachedHapticsEnabled: boolean | null = null;

const isSupportedPlatform = (): boolean => Platform.OS !== 'web';

export const getHapticsEnabled = async (): Promise<boolean> => {
  if (cachedHapticsEnabled !== null) {
    return cachedHapticsEnabled;
  }

  try {
    const storedValue = await AsyncStorage.getItem(HAPTICS_ENABLED_STORAGE_KEY);
    cachedHapticsEnabled = storedValue !== 'false';
    return cachedHapticsEnabled;
  } catch {
    cachedHapticsEnabled = true;
    return true;
  }
};

export const loadHapticsPreference = getHapticsEnabled;

export const setHapticsEnabled = async (enabled: boolean): Promise<void> => {
  cachedHapticsEnabled = enabled;

  try {
    await AsyncStorage.setItem(
      HAPTICS_ENABLED_STORAGE_KEY,
      enabled ? 'true' : 'false',
    );
  } catch {
    // Ignore persistence failures and keep the in-memory preference.
  }
};

const runHaptic = async (callback: () => Promise<unknown>): Promise<void> => {
  if (!isSupportedPlatform()) {
    return;
  }

  const enabled = await getHapticsEnabled();
  if (!enabled) {
    return;
  }

  try {
    await callback();
  } catch {
    // Silently fail on unsupported devices or simulators.
  }
};

export const triggerHapticFeedback = {
  light: (): Promise<void> =>
    runHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),

  medium: (): Promise<void> =>
    runHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),

  heavy: (): Promise<void> =>
    runHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),

  selection: (): Promise<void> => runHaptic(() => Haptics.selectionAsync()),

  success: (): Promise<void> =>
    runHaptic(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    ),

  warning: (): Promise<void> =>
    runHaptic(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
    ),

  error: (): Promise<void> =>
    runHaptic(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
    ),
};
