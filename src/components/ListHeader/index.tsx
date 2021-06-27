import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';

type Props = {
  title: string;
  subtitle: string;
}

import { styles } from './styles'

export function ListHeader({title, subtitle}: Props) {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        { title }
      </Text>

      <Text style={styles.subtitle}>
        { subtitle }
      </Text>
    </View>
  );
}

