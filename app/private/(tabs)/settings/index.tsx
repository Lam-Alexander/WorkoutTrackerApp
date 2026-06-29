import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { supabase } from "../../../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  LogOut,
  User,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  Dumbbell,
} from "lucide-react-native";

const TEAL = "#00C9A7";

// ─── types ────────────────────────────────────────────────────────────────────

type SettingsRowProps = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  isDestructive?: boolean;
};

// ─── reusable row component ───────────────────────────────────────────────────

const SettingsRow = ({ icon, label, onPress, isDestructive = false }: SettingsRowProps) => (
  <TouchableOpacity style={settingsRowStyles.row} onPress={onPress} activeOpacity={0.7}>
    <View style={settingsRowStyles.iconWrapper}>{icon}</View>
    <Text style={[settingsRowStyles.label, isDestructive && settingsRowStyles.labelDestructive]}>
      {label}
    </Text>
    <ChevronRight size={16} color={isDestructive ? "#EF4444" : "#CBD5E1"} />
  </TouchableOpacity>
);

// ─── section wrapper ──────────────────────────────────────────────────────────

const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={sectionStyles.container}>
    <Text style={sectionStyles.title}>{title}</Text>
    <View style={sectionStyles.card}>{children}</View>
  </View>
);

// ─── divider ─────────────────────────────────────────────────────────────────

const RowDivider = () => <View style={{ height: 1, backgroundColor: "#F1F5F9", marginLeft: 52 }} />;

// ─── main settings page ───────────────────────────────────────────────────────

const Settings = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.log("Supabase error signing out:", error.message);
          }

          // Clear session for devices affected by multi-device login issues
          await (supabase.auth as any)._removeSession();

          const { data: { session } } = await supabase.auth.getSession();
          console.log("Session after signout:", session);
          console.log("Signed out successfully");

          router.push("/");
        },
      },
    ]);
  };

  // Placeholder handlers — wire these up as screens are built
  const handleComingSoon = () =>
    Alert.alert("Coming Soon", "This feature is on its way!");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* ── header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            My <Text style={styles.headerAccent}>Settings</Text>
          </Text>
          <Text style={styles.headerSub}>Manage your account & preferences</Text>
        </View>

        {/* ── profile card ── */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={handleComingSoon}
          activeOpacity={0.8}
        >
          <View style={styles.profileAvatar}>
            <Dumbbell size={28} color={TEAL} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Your Profile</Text>
            <Text style={styles.profileSub}>View and edit your details</Text>
          </View>
          <ChevronRight size={18} color="#CBD5E1" />
        </TouchableOpacity>

        {/* ── account section ── */}
        <SettingsSection title="Account">
          <SettingsRow
            icon={<User size={18} color={TEAL} />}
            label="Personal Information"
            onPress={handleComingSoon}
          />
          <RowDivider />
          <SettingsRow
            icon={<Shield size={18} color={TEAL} />}
            label="Privacy & Security"
            onPress={handleComingSoon}
          />
        </SettingsSection>

        {/* ── preferences section ── */}
        <SettingsSection title="Preferences">
          <SettingsRow
            icon={<Bell size={18} color={TEAL} />}
            label="Notifications"
            onPress={handleComingSoon}
          />
        </SettingsSection>

        {/* ── support section ── */}
        <SettingsSection title="Support">
          <SettingsRow
            icon={<HelpCircle size={18} color={TEAL} />}
            label="Help & FAQ"
            onPress={handleComingSoon}
          />
        </SettingsSection>

        {/* ── sign out section ── */}
        <SettingsSection title="Account Actions">
          <SettingsRow
            icon={<LogOut size={18} color="#EF4444" />}
            label="Sign Out"
            onPress={handleSignOut}
            isDestructive
          />
        </SettingsSection>

        {/* ── app version footer ── */}
        <Text style={styles.versionLabel}>Version 1.0.0</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

// ─── styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },

  // ── header ────────────────────────────────────────────────────────────────
  header: {
    marginHorizontal: 25,
    marginTop: 28,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  headerAccent: {
    color: TEAL,
  },
  headerSub: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
    marginTop: 2,
  },

  // ── profile card ──────────────────────────────────────────────────────────
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 25,
    marginBottom: 28,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E6FFFA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  profileSub: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
    marginTop: 2,
  },

  // ── version footer ────────────────────────────────────────────────────────
  versionLabel: {
    textAlign: "center",
    fontSize: 12,
    color: "#CBD5E1",
    fontWeight: "500",
    marginTop: 8,
    marginBottom: 16,
  },
});

const sectionStyles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    marginBottom: 20,
  },
  title: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
    overflow: "hidden",
  },
});

const settingsRowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  labelDestructive: {
    color: "#EF4444",
  },
});

