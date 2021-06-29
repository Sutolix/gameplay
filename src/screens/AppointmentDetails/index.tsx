import React, { useState, useEffect } from 'react';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Fontisto } from '@expo/vector-icons';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  Alert,
  Share,
  Platform
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { api } from '../../services/api';

import { styles } from './styles';
import { theme } from '../../global/styles/theme';

import BannerImg from '../../assets/banner.png'

import { AppointmentProps } from '../../components/Appointment';
import { Background } from '../../components/Background';
import { ListHeader } from '../../components/ListHeader';
import { Header } from '../../components/Header';
import { Member, MemberProps } from '../../components/Member';
import { ListDivider } from '../../components/ListDivider';
import { ButtonIcon } from '../../components/ButtonIcon';
import { Load } from '../../components/Load';

type Params = {
  appointmentSelected: AppointmentProps;
}

type GuildWidget = {
  id: string;
  name: string;
  instant_invite: string;
  members: MemberProps[];
}

export function AppointmentDetails() {

  const [widget, setWidget] = useState<GuildWidget>({} as GuildWidget);
  const [hasWidget, setHasWidget] = useState(false);
  const [loading, setLoading] = useState(true);

  const route = useRoute();

  const { appointmentSelected } = route.params as Params;

  async function fetchGuildWidget() {
    try {
      const response = await api.get(`/guilds/${appointmentSelected.guild.id}/widget.json`);
      setWidget(response.data)
      setHasWidget(true);
    } catch (error) {
      Alert.alert('Hmm... Talvez o Widget desse servidor esteja desativado.')
    } finally {
      setLoading(false);
    }
  }

  function handleShareInvitation() {

    const message = Platform.OS === 'ios'
      ? `Junte-se a ${appointmentSelected.guild.name}`
      : widget.instant_invite

    Share.share({
      message,
      url: widget.instant_invite
    })
  }

  function handleOpenGuild() {
    Linking.openURL(widget.instant_invite);
  }

  useEffect(() => {
    fetchGuildWidget();
  }, []);

  return (
    <Background>
      <Header
        title="Detalhes"
        action={
          appointmentSelected.guild.owner &&
          <BorderlessButton onPress={handleShareInvitation}>
            <Fontisto
              name="share"
              size={24}
              color={theme.colors.primary}
            />
          </BorderlessButton>
        }
      />

      <ImageBackground
        source={BannerImg}
        style={styles.banner}
      >
        <View style={styles.bannerContent}>
          <Text style={styles.title}>
            {appointmentSelected.guild.name}
          </Text>

          <Text style={styles.subtitle}>
            {appointmentSelected.description}
          </Text>
        </View>

      </ImageBackground>


      {
        loading ? <Load /> :
          <>
            <ListHeader
              title="Jogadores"
              subtitle={`Total ${widget.members ? widget.members.length : ''}`}
            />

            <FlatList
              data={widget.members}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <Member
                  data={item}
                />
              )}
              ItemSeparatorComponent={() => <ListDivider isCentered />}
              style={styles.members}
            />
          </>
      }

      {
        appointmentSelected.guild.owner &&
        <View style={styles.footer}>
          <ButtonIcon
            title="Entrar na partida"
            onPress={handleOpenGuild}
          />
        </View>
      }


    </Background>
  )
}