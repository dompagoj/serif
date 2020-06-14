import { css } from 'css-rn';
import React from 'react';
import { View as RNView } from 'react-native';

export interface IFlexViewProps {
  alignItemsCenter?: boolean;
  flexDirectionRow?: boolean;
  justifyContentSpaceBetween?: boolean;
  justifyContentSpaceEvenly?: boolean;
  justifyContentSpaceAround?: boolean;
  justifyContentCenter?: boolean;
  justifyContentEnd?: boolean;
  style?: any;
  children?: any;
  marginBetween?: number;
  marginTop?: number;
  sideMargin?: number;
  borderBetween?: { width: number; type: string; color: string };
  flex?: number;
  view?: any;
  fullWidth?: boolean;
}

function alignItemsValueFromProps(props: IFlexViewProps) {
  const { alignItemsCenter } = props;
  if (alignItemsCenter) {
    return 'center';
  }
}

function flexDirectionValueFromProps(props: IFlexViewProps) {
  const { flexDirectionRow } = props;
  if (flexDirectionRow) {
    return 'row';
  }
}

function rewireChildren(props: IFlexViewProps) {
  const { children, marginBetween, flexDirectionRow, borderBetween } = props;
  const childrenCount = React.Children.count(children);

  if (!marginBetween || childrenCount < 2) {
    return children;
  }

  return React.Children.map(children, (child, index) => {
    const style = {} as any;

    if (index !== 0) {
      if (flexDirectionRow) {
        style.marginLeft = marginBetween / 2;
      } else {
        style.marginTop = marginBetween / 2;
        if (borderBetween) {
          style.borderType = borderBetween.type;
        }
      }
    }

    if (index + 1 < childrenCount) {
      if (flexDirectionRow) {
        style.marginRight = marginBetween / 2;
      } else {
        style.marginBottom = marginBetween / 2;
      }
    }

    return React.cloneElement(child, { style: [child.props.style, style] });
  });
}

function justifyContentFromProps(props: IFlexViewProps) {
  const {
    justifyContentSpaceBetween,
    justifyContentCenter,
    justifyContentSpaceEvenly,
    justifyContentSpaceAround,
    justifyContentEnd,
  } = props;

  if (justifyContentSpaceBetween) {
    return 'space-between';
  }

  if (justifyContentCenter) {
    return 'center';
  }

  if (justifyContentSpaceEvenly) {
    return 'space-evenly';
  }

  if (justifyContentSpaceAround) {
    return 'space-around';
  }

  if (justifyContentEnd) {
    return 'flex-end';
  }
}

function leftRightMarginFromProps(props: IFlexViewProps) {
  const { sideMargin } = props;
  if (!sideMargin) {
    return 0;
  }
  return sideMargin;
}

export const FlexView = (props: IFlexViewProps) => {
  const { style, marginTop = 0, flex, view: View = RNView, fullWidth } = props;

  const defaultStyle = css`
    align-items: ${alignItemsValueFromProps(props)};
    flex-direction: ${flexDirectionValueFromProps(props)};
    margin-top: ${marginTop}px;
    justify-content: ${justifyContentFromProps(props)};
    margin-left: ${leftRightMarginFromProps(props)}px;
    margin-right: ${leftRightMarginFromProps(props)}px;
    flex: ${flex};
    width: ${fullWidth ? '100%' : undefined};
  `;

  return <View style={[defaultStyle, style]}>{rewireChildren(props)}</View>;
};
