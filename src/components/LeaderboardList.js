import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import colors from '../constants/colors';

const LeaderboardList = ({ data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.rank}>{index + 1}.</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.score} pts</Text>
          </View>
        )}
      />
    </View>
  );
};

export default LeaderboardList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  name: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
    marginLeft: 10,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondary,
  },
});
