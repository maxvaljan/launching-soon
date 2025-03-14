import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MapPin, Circle, Clock, Plus, X, ChevronDown, CircleCheck as CheckCircle, Calendar } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

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

export function OrderStops({
  stops,
  onAddStop,
  onUpdateStop,
  onFocusStop,
  onDeleteStop,
}: OrderStopsProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState('Now');
  const [timeMode, setTimeMode] = useState<'now' | 'later'>('now');
  const [showDateSelector, setShowDateSelector] = useState(false);

  const handleDeleteStop = (id: string) => {
    if (onDeleteStop) {
      onDeleteStop(id);
    }
  };

  const toggleTimeModal = () => {
    setTimeModalVisible(!timeModalVisible);
    setShowDateSelector(false);
  };

  const selectTime = (time: 'now' | 'later') => {
    setTimeMode(time);
    if (time === 'now') {
      setSelectedTime('Now');
      setTimeModalVisible(false);
    } else {
      setShowDateSelector(true);
    }
  };

  const confirmTimeSelection = () => {
    if (timeMode === 'later') {
      setSelectedTime('Today, 6:29 AM');
    }
    setTimeModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {stops.map((stop, index) => (
        <View key={stop.id} style={styles.stopRow}>
          <View style={styles.iconContainer}>
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
              placeholder={stop.type === 'pickup' ? 'Pick-up location' : 'Drop-off location'}
              placeholderTextColor={colors.grayText}
              value={stop.address}
              onChangeText={(text) => onUpdateStop(stop.id, text)}
              onFocus={() => onFocusStop(stop.id)}
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
      
      {stops.length < 5 && (
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
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colorScheme === 'dark' ? colors.card : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Pick-up time</Text>
            
            {!showDateSelector ? (
              <>
                <TouchableOpacity 
                  style={styles.timeOption} 
                  onPress={() => selectTime('now')}
                >
                  <View style={styles.timeOptionContent}>
                    <Clock size={20} color={colors.text} />
                    <Text style={[styles.timeOptionText, { color: colors.text }]}>Now</Text>
                  </View>
                  {timeMode === 'now' && (
                    <CheckCircle size={20} color="#f1ebdb" />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.timeOption} 
                  onPress={() => selectTime('later')}
                >
                  <View style={styles.timeOptionContent}>
                    <Calendar size={20} color={colors.text} />
                    <Text style={[styles.timeOptionText, { color: colors.text }]}>Later</Text>
                  </View>
                  {timeMode === 'later' && (
                    <CheckCircle size={20} color="#f1ebdb" />
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <ScrollView>
                <View style={styles.dateTimeContainer}>
                  <View style={styles.locationInfo}>
                    <Text style={[styles.locationLabel, { color: colors.grayText }]}>Singapore (GMT+8)</Text>
                  </View>
                  
                  <View style={styles.daySelector}>
                    {['Thu Mar 6', 'Fri Mar 7', 'Sat Mar 8'].map((day, index) => (
                      <View key={index} style={[
                        styles.dayOption,
                        index === 2 ? styles.selectedDayOption : {}
                      ]}>
                        <Text style={[
                          styles.dayText,
                          index === 2 ? styles.selectedDayText : { color: '#aaa' }
                        ]}>
                          {day.split(' ')[0]}
                        </Text>
                        <Text style={[
                          styles.dayNumberText,
                          index === 2 ? styles.selectedDayText : { color: colors.text }
                        ]}>
                          {day.split(' ')[1]} {parseInt(day.split(' ')[2]) + 26}
                        </Text>
                      </View>
                    ))}
                  </View>
                  
                  <View style={styles.timeRowContainer}>
                    <View style={[styles.timeRow, styles.selectedTimeRow]}>
                      <Text style={styles.timeRowText}>Today</Text>
                      <Text style={styles.timeRowNumber}>6</Text>
                      <Text style={styles.timeRowNumber}>29</Text>
                      <Text style={styles.timeRowAmPm}>AM</Text>
                    </View>
                    {['Mon Mar 10', 'Tue Mar 11', 'Wed Mar 12'].map((day, index) => (
                      <View key={index} style={styles.timeRow}>
                        <Text style={[styles.timeRowText, { color: '#aaa' }]}>{day.split(' ')[0]}</Text>
                        <Text style={[styles.timeRowNumber, { color: '#aaa' }]}>{7 + index}</Text>
                        <Text style={[styles.timeRowNumber, { color: '#aaa' }]}>{30 + index}</Text>
                        <Text style={[styles.timeRowAmPm, { color: '#aaa' }]}>PM</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>
            )}
            
            <TouchableOpacity 
              style={[styles.closeButton, { backgroundColor: colors.accent }]}
              onPress={confirmTimeSelection}
            >
              <Text style={[styles.closeButtonText, { color: '#0e1424' }]}>
                {showDateSelector ? 'Schedule' : 'Done'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    width: 24,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 24,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  timeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeOptionText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginLeft: 12,
  },
  closeButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  dateTimeContainer: {
    marginTop: 16,
  },
  locationInfo: {
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  dayOption: {
    alignItems: 'center',
    padding: 8,
  },
  selectedDayOption: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  dayNumberText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  selectedDayText: {
    color: '#222',
    fontFamily: 'Inter-SemiBold',
  },
  timeRowContainer: {
    marginTop: 10,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  selectedTimeRow: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  timeRowText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#222',
    flex: 2,
  },
  timeRowNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#222',
    flex: 1,
    textAlign: 'center',
  },
  timeRowAmPm: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#222',
    flex: 1,
    textAlign: 'center',
  },
});