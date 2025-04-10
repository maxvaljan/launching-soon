import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Platform } from 'react-native';
import { MapPin, Circle, Clock, Plus, X, ChevronDown, CircleCheck as CheckCircle, Calendar } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

export interface Stop {
  id: string;
  type: 'pickup' | 'dropoff';
  address: string;
}

interface OrderStopsProps {
  stops: Stop[];
  onAddStop: () => void;
  onUpdateStop: (id: string, address: string) => void;
  onFocusStop: (id: string) => void;
  onDeleteStop?: (id: string) => void;
}

// Define a constant for modal background color
const MODAL_BACKGROUND_COLORS = {
  light: '#fff',
  dark: '#1a202c',
};

export function OrderStops({
  stops,
  onAddStop,
  onUpdateStop,
  onFocusStop,
  onDeleteStop,
}: OrderStopsProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState('Now');
  const [timeMode, setTimeMode] = useState<'now' | 'later'>('now');
  const [scheduledDateTime, setScheduledDateTime] = useState(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  const formatDateTime = (date: Date): string => {
    const today = new Date();
    const isToday = date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();

    const prefix = isToday ? 'Today, ' : date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) + ', ';
    
    return prefix + date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleDeleteStop = (id: string) => {
    if (onDeleteStop) {
      onDeleteStop(id);
    }
  };

  const handleFocusAddress = (id: string) => {
    // Get the stop type ('pickup' or 'dropoff')
    const stop = stops.find(s => s.id === id);
    if (stop) {
      // Use the original onFocusStop for any necessary side effects
      if (onFocusStop) {
        onFocusStop(id);
      }
      
      // Navigate to the location search screen with the stop ID and type
      router.push({
        pathname: '/location-search',
        params: { stopId: id, type: stop.type }
      });
    }
  };

  const toggleTimeModal = () => {
    if (timeModalVisible) {
        setShowDateTimePicker(false);
    }
    if (!timeModalVisible && timeMode === 'now') {
        setScheduledDateTime(new Date());
    }
    setTimeModalVisible(!timeModalVisible);
  };

  const selectTimeMode = (mode: 'now' | 'later') => {
    setTimeMode(mode);
    if (mode === 'now') {
        setShowDateTimePicker(false);
    } else {
        setShowDateTimePicker(true);
    }
  };

  const handleDateTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || scheduledDateTime;
    setScheduledDateTime(currentDate);
  };

  const confirmSchedule = () => {
    if (timeMode === 'now') {
      setSelectedTime('Now');
    } else {
      setSelectedTime(formatDateTime(scheduledDateTime));
    }
    setTimeModalVisible(false);
  };

  // Extract styles to avoid inline styles
  const getIconContainerStyle = (index: number) => [
    styles.iconContainer,
    { width: 24 }
  ];

  // Define common styles to reduce inline style usage
  const modalContentStyle = [
    styles.modalContent, 
    { backgroundColor: colorScheme === 'dark' ? colors.card : MODAL_BACKGROUND_COLORS.light }
  ];

  return (
    <View style={styles.container}>
      {stops.map((stop, index) => (
        <View key={stop.id} style={styles.stopRow}>
          <View style={getIconContainerStyle(index)}>
            {stop.type === 'pickup' ? (
              <Circle 
                size={12} 
                fill={colors.accent} 
                color={colors.accent} 
              />
            ) : (
              <MapPin 
                size={16} 
                color={colors.accent} 
              />
            )}
            {index < stops.length - 1 && (
              <View style={[styles.connector, { backgroundColor: colors.accent }]} />
            )}
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colorScheme === 'dark' ? colors.secondary : colors.gray }]}
              placeholder={
                index === 0
                  ? 'Pick-up location'
                  : index === stops.length - 1
                  ? 'Drop-off location'
                  : `Mid-stop location ${index}`
              }
              placeholderTextColor={colors.grayText}
              value={stop.address}
              onChangeText={(text) => onUpdateStop(stop.id, text)}
              onFocus={() => handleFocusAddress(stop.id)}
            />
            
            {index === 0 && (
              <View style={styles.timeContainer}>
                <TouchableOpacity style={styles.timeButton} onPress={toggleTimeModal}>
                  <Text style={[styles.timeText, { color: colors.text }]}>{selectedTime}</Text>
                  <ChevronDown size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            )}
            
            {index !== 0 && index !== stops.length - 1 && stops.length > 2 && (
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteStop(stop.id)}
              >
                <X size={16} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
      
      {stops.length < 22 && (
        <TouchableOpacity 
          style={styles.addStopButton} 
          onPress={onAddStop}
        >
          <Plus size={16} color={colors.text} />
          <Text style={[styles.addStopText, { color: colors.text }]}>Add Stop</Text>
        </TouchableOpacity>
      )}

      {/* Time Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={timeModalVisible}
        onRequestClose={toggleTimeModal}
      >
        <TouchableWithoutFeedback onPress={toggleTimeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={modalContentStyle}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Pick-up time</Text>
                
                {!showDateTimePicker ? (
                    <>
                        <TouchableOpacity 
                            style={styles.timeOptionRow} 
                            onPress={() => selectTimeMode('now')}
                        >
                            <View style={styles.timeOptionIconText}>
                                <Clock size={24} color={colors.text} style={styles.timeOptionIcon} />
                                <Text style={[styles.timeOptionLabel, { color: colors.text }]}>Now</Text>
                            </View>
                            {timeMode === 'now' && (
                                <CheckCircle size={20} color={colors.primary} />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.timeOptionRow} 
                            onPress={() => selectTimeMode('later')}
                        >
                            <View style={styles.timeOptionIconText}>
                                <Calendar size={24} color={colors.text} style={styles.timeOptionIcon} />
                                <View>
                                    <Text style={[styles.timeOptionLabel, { color: colors.text }]}>
                                        {timeMode === 'later' && showDateTimePicker ? formatDateTime(scheduledDateTime) : 'Later'}
                                    </Text>
                                </View>
                            </View>
                            {timeMode === 'later' && (
                                <CheckCircle size={20} color={colors.primary} />
                            )}
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.dateTimePickerContainer}>
                        <TouchableOpacity 
                            style={styles.timeOptionRow} 
                            onPress={() => selectTimeMode('now')}
                        >
                            <View style={styles.timeOptionIconText}>
                                <Clock size={24} color={colors.text} style={styles.timeOptionIcon} />
                                <Text style={[styles.timeOptionLabel, { color: colors.text }]}>Now</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.timeOptionRow} 
                            onPress={() => selectTimeMode('later')}
                        >
                            <View style={styles.timeOptionIconText}>
                                <Calendar size={24} color={colors.text} style={styles.timeOptionIcon} />
                                <View>
                                    <Text style={[styles.timeOptionLabel, { color: colors.text }]}>
                                        {formatDateTime(scheduledDateTime)}
                                    </Text>
                                </View>
                            </View>
                            <CheckCircle size={20} color={colors.primary} />
                        </TouchableOpacity>

                        <DateTimePicker
                            testID="dateTimePicker"
                            value={scheduledDateTime}
                            mode="datetime"
                            is24Hour={false}
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onChange={handleDateTimeChange}
                            style={styles.dateTimePicker}
                            minimumDate={new Date()}
                            minuteInterval={1}
                        />
                    </View>
                )}

                <TouchableOpacity 
                    style={[styles.scheduleButton, { backgroundColor: colors.primary }]}
                    onPress={confirmSchedule}
                >
                    <Text style={[styles.scheduleButtonText, { color: colors.accent }]}>
                        Schedule
                    </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  connector: {
    width: 2,
    height: 24,
    marginTop: 4,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  timeContainer: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timeText: {
    marginRight: 4,
    fontWeight: '500',
  },
  deleteButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
    borderRadius: 12,
  },
  addStopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  addStopText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 24,
    textAlign: 'center',
  },
  timeOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  timeOptionIconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeOptionIcon: {
    marginRight: 16,
  },
  timeOptionLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  dateTimePickerContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  dateTimePicker: {
    height: 180,
  },
  scheduleButton: {
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  scheduleButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
});