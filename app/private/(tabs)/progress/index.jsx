import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { supabase } from "../../../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react-native";

// ─── date helpers ────────────────────────────────────────────────────────────

/**
 * Returns a YYYY-MM-DD string in the device's LOCAL timezone.
 * Using toISOString() would convert to UTC first, which can shift
 * the date backward by hours for users west of UTC (e.g. Calgary, UTC-6),
 * causing Sunday's logs to appear under Saturday.
 */
const toLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** Returns a new Date set to midnight on the given date, in local time */
const getStartOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/**
 * Returns a new Date set to the most recent Sunday at local midnight.
 * dayOfWeek is read before any mutation to avoid chaining side effects.
 */
const getStartOfWeek = (date) => {
  const dayOfWeek = date.getDay(); // 0 = Sunday
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayOfWeek);
};

/** Returns a new Date set to Saturday of the same week at 23:59:59.999 */
const getEndOfWeek = (date) => {
  const dayOfWeek = date.getDay();
  const daysUntilSaturday = 6 - dayOfWeek;
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + daysUntilSaturday,
    23, 59, 59, 999
  );
};

/** Returns the first day of the given date's month at local midnight */
const getStartOfMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

/** Returns the last moment of the given date's month in local time */
const getEndOfMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

/** Formats a date using toLocaleDateString with the given options */
const formatDate = (date, options) =>
  date.toLocaleDateString("en-US", options);

/** Returns true if two dates fall on the same calendar day */
const isSameDay = (dateA, dateB) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate();

/** Returns true if a date falls within the same week (Sun–Sat) as the anchor */
const isSameWeek = (date, anchorDate) => {
  const weekStart = getStartOfWeek(anchorDate);
  const weekEnd = getEndOfWeek(anchorDate);
  return date >= weekStart && date <= weekEnd;
};

/** Returns true if a date falls in the same month and year as the anchor */
const isSameMonth = (date, anchorDate) =>
  date.getFullYear() === anchorDate.getFullYear() &&
  date.getMonth() === anchorDate.getMonth();

const TEAL = "#00C9A7";
const TEAL_LIGHT = "#E6FFFA";
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// ─── CalendarPicker component ────────────────────────────────────────────────

/**
 * Inline calendar grid that adapts highlight behaviour to the active filter:
 *   Day   → highlights the single selected day
 *   Week  → highlights the full Sun–Sat row containing the selected day
 *   Month → highlights every day in the selected month
 */
const CalendarPicker = ({ activeFilter, anchorDate, onSelectDate, onClose }) => {
  // The calendar always shows one month; start browsing from the anchor's month
  const [calendarViewDate, setCalendarViewDate] = useState(
    new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1)
  );

  const shiftCalendarMonth = (direction) => {
    setCalendarViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1)
    );
  };

  // Build the grid: pad the first row with nulls so day 1 starts on the right weekday
  const buildCalendarGrid = () => {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let paddingIndex = 0; paddingIndex < firstDayOfMonth; paddingIndex++) {
      cells.push(null); // empty leading cells
    }
    for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
      cells.push(new Date(year, month, dayNumber));
    }
    return cells;
  };

  const calendarCells = buildCalendarGrid();

  /** Returns whether a given calendar cell date should appear highlighted */
  const isDayHighlighted = (cellDate) => {
    if (!cellDate) return false;
    if (activeFilter === "Day") return isSameDay(cellDate, anchorDate);
    if (activeFilter === "Week") return isSameWeek(cellDate, anchorDate);
    if (activeFilter === "Month") return isSameMonth(cellDate, anchorDate);
    return false;
  };

  /** Returns whether a cell is at the start edge of the highlighted range */
  const isHighlightStart = (cellDate) => {
    if (!cellDate || activeFilter === "Day") return false;
    if (activeFilter === "Week") return cellDate.getDay() === 0 && isSameWeek(cellDate, anchorDate);
    if (activeFilter === "Month") return cellDate.getDate() === 1 && isSameMonth(cellDate, anchorDate);
    return false;
  };

  /** Returns whether a cell is at the end edge of the highlighted range */
  const isHighlightEnd = (cellDate) => {
    if (!cellDate || activeFilter === "Day") return false;
    if (activeFilter === "Week") return cellDate.getDay() === 6 && isSameWeek(cellDate, anchorDate);
    if (activeFilter === "Month") {
      const lastDay = new Date(cellDate.getFullYear(), cellDate.getMonth() + 1, 0).getDate();
      return cellDate.getDate() === lastDay && isSameMonth(cellDate, anchorDate);
    }
    return false;
  };

  const monthYearLabel = formatDate(calendarViewDate, { month: "long", year: "numeric" });
  const today = new Date();

  return (
    <View style={calendarStyles.container}>
      {/* Month navigation header */}
      <View style={calendarStyles.monthNavRow}>
        <TouchableOpacity
          onPress={() => shiftCalendarMonth(-1)}
          style={calendarStyles.monthNavBtn}
        >
          <ChevronLeft size={18} color="#64748B" />
        </TouchableOpacity>
        <Text style={calendarStyles.monthYearLabel}>{monthYearLabel}</Text>
        <TouchableOpacity
          onPress={() => shiftCalendarMonth(1)}
          style={calendarStyles.monthNavBtn}
        >
          <ChevronRight size={18} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Day-of-week header row */}
      <View style={calendarStyles.dayNamesRow}>
        {DAY_NAMES.map((dayName) => (
          <Text key={dayName} style={calendarStyles.dayNameCell}>
            {dayName}
          </Text>
        ))}
      </View>

      {/* Calendar day grid */}
      <View style={calendarStyles.grid}>
        {calendarCells.map((cellDate, cellIndex) => {
          const highlighted = isDayHighlighted(cellDate);
          const isStart = isHighlightStart(cellDate);
          const isEnd = isHighlightEnd(cellDate);
          const isToday = cellDate ? isSameDay(cellDate, today) : false;
          // For range modes, cells between start/end get a flat background strip
          const isMiddleOfRange =
            highlighted && activeFilter !== "Day" && !isStart && !isEnd;

          return (
            <TouchableOpacity
              key={cellIndex}
              style={[
                calendarStyles.dayCell,
                // Range strip background (flat, no border radius)
                isMiddleOfRange && calendarStyles.dayCellRangeMiddle,
                // Left-rounded cap for range start
                isStart && calendarStyles.dayCellRangeStart,
                // Right-rounded cap for range end
                isEnd && calendarStyles.dayCellRangeEnd,
              ]}
              onPress={() => cellDate && onSelectDate(cellDate)}
              disabled={!cellDate}
            >
              <View
                style={[
                  calendarStyles.dayNumber,
                  // Single-day circle highlight
                  highlighted && activeFilter === "Day" && calendarStyles.dayNumberSelected,
                  // Cap dots for range start/end
                  (isStart || isEnd) && calendarStyles.dayNumberRangeCap,
                ]}
              >
                <Text
                  style={[
                    calendarStyles.dayNumberText,
                    (highlighted && activeFilter === "Day" || isStart || isEnd) && calendarStyles.dayNumberTextHighlighted,
                    isToday && !highlighted && calendarStyles.dayNumberTextToday,
                    isToday && isMiddleOfRange && calendarStyles.dayNumberTextToday,
                  ]}
                >
                  {cellDate ? cellDate.getDate() : ""}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Close button */}
      <TouchableOpacity onPress={onClose} style={calendarStyles.closeBtn}>
        <Text style={calendarStyles.closeBtnText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── main ProgressPage component ─────────────────────────────────────────────

const ProgressPage = () => {
  const [activeFilter, setActiveFilter] = useState("Week"); // "Day" | "Week" | "Month"
  const [anchorDate, setAnchorDate] = useState(new Date()); // the date used to derive the current period
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  // ── derive start/end dates from the anchor date and active filter ─────────

  const dateRange = (() => {
    if (activeFilter === "Day") {
      const periodStart = getStartOfDay(anchorDate);
      const periodEnd = new Date(periodStart);
      periodEnd.setHours(23, 59, 59, 999);
      return { start: periodStart, end: periodEnd };
    }
    if (activeFilter === "Week") {
      return {
        start: getStartOfWeek(anchorDate),
        end: getEndOfWeek(anchorDate),
      };
    }
    return {
      start: getStartOfMonth(anchorDate),
      end: getEndOfMonth(anchorDate),
    };
  })();

  const dateRangeLabel = (() => {
    if (activeFilter === "Day")
      return formatDate(dateRange.start, {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    if (activeFilter === "Week") {
      const startLabel = formatDate(dateRange.start, { month: "short", day: "numeric" });
      const endLabel = formatDate(dateRange.end, { month: "short", day: "numeric", year: "numeric" });
      return `${startLabel} – ${endLabel}`;
    }
    return formatDate(dateRange.start, { month: "long", year: "numeric" });
  })();

  // ── navigate period with chevrons ─────────────────────────────────────────

  const shiftPeriod = (direction) => {
    const nextDate = new Date(anchorDate);
    if (activeFilter === "Day") nextDate.setDate(nextDate.getDate() + direction);
    else if (activeFilter === "Week") nextDate.setDate(nextDate.getDate() + direction * 7);
    else nextDate.setMonth(nextDate.getMonth() + direction);
    setAnchorDate(nextDate);
  };

  // ── handle a day tap from the calendar ───────────────────────────────────

  const handleCalendarDateSelect = (selectedDate) => {
    setAnchorDate(selectedDate);
    setIsCalendarVisible(false);
  };

  // ── fetch workout logs for the current date range ─────────────────────────

  const fetchWorkoutLogs = useCallback(async () => {
    setIsLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setIsLoading(false); return; }

    // Use local date string (not toISOString) to prevent UTC conversion
    // from shifting the date backward for timezones west of UTC
    const startDateIso = toLocalDateString(dateRange.start);
    const endDateIso = toLocalDateString(dateRange.end);

    const { data: rawLogs, error } = await supabase
      .from("workout_log")
      .select(
        `id,
         workout_date,
         workout_template_name,
         exercise_log (
           id,
           exercise_name,
           sets (
             id,
             set_number,
             reps,
             weights,
             set_order_idx
           )
         )`
      )
      .eq("profile_id", user.id)
      .gte("workout_date", startDateIso)
      .lte("workout_date", endDateIso)
      .order("workout_date", { ascending: false });

    if (error) {
      console.log("Progress fetch error:", error.message);
      setWorkoutLogs([]);
    } else {
      // Sort each exercise's sets by their display order index
      const logsWithSortedSets = (rawLogs ?? []).map((workoutLog) => ({
        ...workoutLog,
        exercise_log: (workoutLog.exercise_log ?? []).map((exerciseLog) => ({
          ...exerciseLog,
          sets: [...(exerciseLog.sets ?? [])].sort(
            (setA, setB) => setA.set_order_idx - setB.set_order_idx
          ),
        })),
      }));
      setWorkoutLogs(logsWithSortedSets);
    }

    setIsLoading(false);
  }, [activeFilter, anchorDate]);

  useEffect(() => { fetchWorkoutLogs(); }, [fetchWorkoutLogs]);

  useFocusEffect(useCallback(() => { fetchWorkoutLogs(); }, [fetchWorkoutLogs]));

  // ── summary stats ─────────────────────────────────────────────────────────

  const totalSessions = workoutLogs.length;

  const totalSets = workoutLogs.reduce(
    (sessionTotal, workoutLog) =>
      sessionTotal +
      (workoutLog.exercise_log ?? []).reduce(
        (exerciseTotal, exerciseLog) => exerciseTotal + (exerciseLog.sets ?? []).length,
        0
      ),
    0
  );

  // ── render helpers ────────────────────────────────────────────────────────

  /** Formats a YYYY-MM-DD date string (from Supabase) into a readable weekday label */
  const formatWorkoutDateLabel = (dateString) => {
    // Append T00:00:00 to avoid UTC-offset shifting the date
    const date = new Date(dateString + "T00:00:00");
    return formatDate(date, { weekday: "long", month: "short", day: "numeric" });
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* ── header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            My <Text style={styles.headerAccent}>Progress</Text>
          </Text>
          <Text style={styles.headerSub}>Track your workout history</Text>
        </View>

        {/* ── filter tabs ── */}
        <View style={styles.filterRow}>
          {["Day", "Week", "Month"].map((tabLabel) => (
            <TouchableOpacity
              key={tabLabel}
              style={[styles.filterTab, activeFilter === tabLabel && styles.filterTabActive]}
              onPress={() => {
                setActiveFilter(tabLabel);
                setAnchorDate(new Date());
                setIsCalendarVisible(false);
              }}
            >
              <Text style={[styles.filterTabText, activeFilter === tabLabel && styles.filterTabTextActive]}>
                {tabLabel}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── period navigator ── */}
        <View style={styles.rangeRow}>
          <TouchableOpacity onPress={() => shiftPeriod(-1)} style={styles.chevronBtn}>
            <ChevronLeft size={20} color="#64748B" />
          </TouchableOpacity>

          {/* Tapping the date label opens/closes the calendar */}
          <TouchableOpacity
            style={styles.rangeLabelBtn}
            onPress={() => setIsCalendarVisible((prev) => !prev)}
          >
            <Calendar size={14} color={TEAL} style={{ marginRight: 6 }} />
            <Text style={styles.rangeLabel}>{dateRangeLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => shiftPeriod(1)} style={styles.chevronBtn}>
            <ChevronRight size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* ── inline calendar picker ── */}
        {isCalendarVisible && (
          <CalendarPicker
            activeFilter={activeFilter}
            anchorDate={anchorDate}
            onSelectDate={handleCalendarDateSelect}
            onClose={() => setIsCalendarVisible(false)}
          />
        )}

        {/* ── summary stats ── */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalSessions}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalSets}</Text>
            <Text style={styles.statLabel}>Total Sets</Text>
          </View>
        </View>

        {/* ── workout log content ── */}
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={TEAL} size="large" />
          </View>
        ) : workoutLogs.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No workouts logged for this period.</Text>
          </View>
        ) : (
          workoutLogs.map((workoutLog) => (
            <View key={workoutLog.id} style={styles.workoutBlock}>

              {/* workout header */}
              <View style={styles.workoutHeaderRow}>
                <View>
                  <Text style={styles.workoutName}>
                    {workoutLog.workout_template_name ?? "Workout"}
                  </Text>
                  <Text style={styles.workoutDate}>
                    {formatWorkoutDateLabel(workoutLog.workout_date)}
                  </Text>
                </View>
                {workoutLog.workout_template_name ? (
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>
                      {workoutLog.workout_template_name.split(" ")[0]}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* exercises */}
              {(workoutLog.exercise_log ?? []).map((exerciseLog) => (
                <View key={exerciseLog.id} style={styles.exerciseBlock}>
                  <Text style={styles.exerciseName}>{exerciseLog.exercise_name}</Text>

                  {/* table header */}
                  <View style={[styles.tableRow, styles.tableHeaderRow]}>
                    <Text style={[styles.colSet, styles.headerCell]}>Set</Text>
                    <Text style={[styles.colReps, styles.headerCell]}>Reps</Text>
                    <Text style={[styles.colWeight, styles.headerCell]}>Weight</Text>
                  </View>

                  {(exerciseLog.sets ?? []).map((set, setIndex) => (
                    <View
                      key={set.id}
                      style={[styles.tableRow, setIndex % 2 === 0 ? styles.rowEven : null]}
                    >
                      <Text style={[styles.colSet, styles.rowCell]}>
                        {set.set_number ?? setIndex + 1}
                      </Text>
                      <Text style={[styles.colReps, styles.rowCellBold]}>{set.reps}</Text>
                      <Text style={[styles.colWeight, styles.rowCellAccent]}>{set.weights}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProgressPage;

// ─── calendar styles ──────────────────────────────────────────────────────────

const calendarStyles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  monthNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  monthNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  monthYearLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  dayNamesRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  dayNameCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    paddingVertical: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  // Each cell is 1/7 of the row
  dayCell: {
    width: "14.2857%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // Flat teal strip for middle cells in a week/month range
  dayCellRangeMiddle: {
    backgroundColor: TEAL_LIGHT,
  },
  // Left-rounded cap for the start of a range
  dayCellRangeStart: {
    backgroundColor: TEAL_LIGHT,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  // Right-rounded cap for the end of a range
  dayCellRangeEnd: {
    backgroundColor: TEAL_LIGHT,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  dayNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  // Filled circle for single-day selection
  dayNumberSelected: {
    backgroundColor: TEAL,
  },
  // Filled teal circle for range start/end caps
  dayNumberRangeCap: {
    backgroundColor: TEAL,
  },
  dayNumberText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#0F172A",
  },
  dayNumberTextHighlighted: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  // Today indicator: teal text when not selected
  dayNumberTextToday: {
    color: TEAL,
    fontWeight: "700",
  },
  closeBtn: {
    marginTop: 12,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 32,
    backgroundColor: TEAL,
    borderRadius: 20,
  },
  closeBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});

// ─── main styles ──────────────────────────────────────────────────────────────

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
    marginTop: 10,
  },

  // ── filter tabs ───────────────────────────────────────────────────────────
  filterRow: {
    flexDirection: "row",
    marginHorizontal: 25,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
  },
  filterTabActive: {
    backgroundColor: TEAL,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  filterTabTextActive: {
    color: "#FFFFFF",
  },

  // ── range navigator ───────────────────────────────────────────────────────
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    gap: 12,
  },
  chevronBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  // Tappable date label that opens the calendar
  rangeLabelBtn: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 180,
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  rangeLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },

  // ── stats ─────────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: TEAL,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 4,
  },

  // ── workout block ─────────────────────────────────────────────────────────
  workoutBlock: {
    marginHorizontal: 25,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  workoutHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  workoutDate: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
    marginTop: 2,
  },
  tagBadge: {
    backgroundColor: "#E6FFFA",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: {
    color: "#065F46",
    fontWeight: "600",
    fontSize: 12,
  },

  // ── exercise block ────────────────────────────────────────────────────────
  exerciseBlock: {
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },

  // ── table ─────────────────────────────────────────────────────────────────
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  tableHeaderRow: {
    marginBottom: 2,
  },
  rowEven: {
    backgroundColor: "#F8FAFC",
  },
  headerCell: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  rowCell: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  rowCellBold: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  rowCellAccent: {
    fontSize: 14,
    fontWeight: "700",
    color: TEAL,
  },
  colSet: {
    flex: 1,
    textAlign: "center",
  },
  colReps: {
    flex: 1,
    textAlign: "center",
  },
  colWeight: {
    flex: 1,
    textAlign: "center",
  },

  // ── empty / loading ───────────────────────────────────────────────────────
  centered: {
    paddingTop: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
});
