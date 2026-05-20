import { ImageSourcePropType } from "react-native";

export type Protocol = {
  id: string;
  title: string;
  headerImage?: string | null;
  images?: string[];
  content: string;
};

export type ProtocolGroup =
  | 'controller'
  | 'emergency'
  | 'security';

export type ProtocolPreview = {
  id: string;
  group: ProtocolGroup;
  title: string;
};
