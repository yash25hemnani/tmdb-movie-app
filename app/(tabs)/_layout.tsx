import { View, Text, ImageBackground, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

import { ImageSourcePropType } from "react-native";

interface TabIconProps {
  focused: boolean;
  label: string;
  icon: ImageSourcePropType;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, label, icon }) => {
  if (focused) {
    return (
      <>
        {/* The pill like shape */}
        <ImageBackground
          source={images.highlight}
          className="flex-row w-full flex-1 min-w-[112px] min-h-14 mt-6 pl-2 pr-2 justify-center items-center gap-2 rounded-full overflow-hidden "
        >
          <Image source={icon} tintColor="black" className="size-5" />
          <Text className="text-secondary text-base font-semibold">
            {label}
          </Text>
        </ImageBackground>
      </>
    );
  }

  return (
    <View className="mt-6 size-full flex justify-center items-center">
      <Image source={icon} tintColor="#FFFFFF" className="size-5" />
    </View>
  );
};

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        // Remove the labels automatically appearing
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        // For the Bottom Nav component
        tabBarStyle: {
          backgroundColor: "#0F0D23",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#0F0D23",
        },
      }}
    >
    {/* Register each page */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            // Focused defines if the tab is on focus
            <TabIcon focused={focused} label="Home" icon={icons.home} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            // Focused defines if the tab is on focus
            <TabIcon focused={focused} label="Search" icon={icons.search} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            // Focused defines if the tab is on focus
            <TabIcon focused={focused} label="Saved" icon={icons.save} />
          ),
        }}
      />


    </Tabs>
  );
};

export default _layout;
