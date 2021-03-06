import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Focus } from './src/features/focus/Focus';
import { FocusHistory } from './src/features/focus/FocusHistory';
import { Timer } from './src/features/Timer/Timer';
import {colors} from './utils/colors';
import { spacing } from './utils/sizes';

import AsyncStorage from '@react-native-async-storage/async-storage'

const STATUSES = {
  COMPLETE: 1,
  CANCELLED: 2,
}

export default function App() {
  const [focusSubject, setFocusSubject] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);

  const addFocusHistorySubjectWithStatus = ( subject, status) => {
    setFocusHistory([...focusHistory, {key: String(focusHistory.length + 1), subject, status}])
  };
  const onClear = () => {
    setFocusHistory([]);
  };

  const saveFocusHistory = async() => {
    try {
      const value1 = JSON.stringify(focusHistory);
      console.log(value1);
      await AsyncStorage.setItem('focusHistory', value1);
    } catch(e) {
      console.log(e);
    }
  };

  const loadFocusHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('focusHistory');

      if(history) {
        setFocusHistory(JSON.parse(history));
      }
    } catch(e){
      console.log(e);
    }
  }

  useEffect(() => {
    loadFocusHistory();
  }, []) //no array items means it runs on the mount of the component, when loaded it will show any history

  useEffect(() => {
    saveFocusHistory();
  }, [focusHistory]); //anytime we interact with this key, it triggers saveFocusHistory

  console.log(focusHistory);
  return (
    <View style={styles.container}>
      {focusSubject ? (
        <Timer focusSubject = {focusSubject} 
        onTimerEnd= {() => {
          addFocusHistorySubjectWithStatus(focusSubject, STATUSES.COMPLETE);
          setFocusSubject(null);
        }} 
        clearSubject={() => {
          addFocusHistorySubjectWithStatus(focusSubject, STATUSES.CANCELLED);
          setFocusSubject(null)
          }}
        />
      ) : (
        <View style={{ flex: 1}}>
          <Focus addSubject={setFocusSubject}/>
          <FocusHistory  focusHistory={focusHistory} onClear={onClear}/>
        </View >
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? spacing.md : spacing.lg,
    backgroundColor: colors.darkBlue,
  },
});
