import React from 'react'

import {
    Image,
    Animated,
    View,
    TouchableHighlight,
    LayoutAnimation,
    StyleSheet
} from 'react-native';

import Style from './Style';
import * as utilities from './utilities';

class ProgressiveImage extends React.Component {
    state = {};

    constructor(props) {
        super(props);

        this.state = {
            thumbnailOpacity: new Animated.Value(0),
            show: false,
            hasImageFailed: false,
            loading: true
        };

        this.onLoad = this.onLoad.bind(this);
        this.onLoadPlaceHolder = this.onLoadPlaceHolder.bind(this);
        this.onImageError = this.onImageError.bind(this);
        this.onThumbnailLoad = this.onThumbnailLoad.bind(this);
        this.renderBusy = this.renderBusy.bind(this);
        this.renderImagePlaceHolder = this.renderImagePlaceHolder.bind(this);
    }

    // componentWillReceiveProps(nextProps) {
    //     if (this.props.isConnected !== nextProps.isConnected) {
    //         if ((!nextProps.isConnected) && this.wasConnected) {
    //             this.wasConnected = false;
    //         } else if (nextProps.isConnected && (!this.wasConnected)) {
    //             this.wasConnected = true;
    //             if ((!this.state.thumbLoaded) || (!this.state.largeLoaded)) {
    //                 this.setState({
    //                     hasImageFailed: false,
    //                     loading: true,
    //                     show: false,
    //                     thumbnailOpacity: new Animated.Value(0)
    //                 });
    //             }
    //         }
    //     }
    // }

    render() {
        // if (this.state.hasImageFailed) {
        //     return this.renderImagePlaceHolder();
        // }

        // //  If no value has been provided for both source and thumbnail, render placeholder
        // if (areAllNullOrWhitespace([this.props.thumbnail.uri, this.props.source.uri])) {
        //     return this.renderImagePlaceHolder(IMAGE_PLACEHOLDER_DEFAULT);
        // }

        // //  If no thumbnail was provided, just load the source image
        // if (isNullOrWhitespace(this.props.thumbnail) || typeof this.props.thumbnail.uri === 'undefined') {
        //     return this.renderImage(this.props.source);
        // }


        if (utilities.isNullOrWhitespace(this.props.thumbnailUrl)) {
            return renderImage(this.props.thumbnailUrl)
        }

        return (
            <View
                width={this.props.style.width}
                height={this.props.style.height}
                style={{ flex: 1 }}
                backgroundColor={'#CCC'}>
                {this.renderBusy()}
                {this.state.show &&
                    <Animated.Image
                        key={this.props.key}
                        resizeMode={'stretch'}
                        style={[{ position: 'absolute' }, this.props.style]}
                        source={this.props.source}
                        onLoad={this.onLoad}
                        onError={(error) => this.onImageError(error.nativeEvent.error)}
                    />
                }

                <Animated.Image
                    resizeMode={'stretch'}
                    key={this.props.key}
                    style={[{ opacity: this.state.thumbnailOpacity }, this.props.style]}
                    source={this.props.thumbnail}
                    onLoad={this.onThumbnailLoad}
                    onError={(error) => this.onImageError(error.nativeEvent.error)}
                />
            </View>
        )
    }

    renderImage(imageSource) {
        return (
            <View
                width={this.props.style.width}
                height={this.props.style.height}
                backgroundColor={'#CCC'}
            >
                <Animated.Image
                    resizeMode={'stretch'}
                    key={this.props.key}
                    style={[{ opacity: this.state.thumbnailOpacity }, this.props.style]}
                    source={imageSource}
                    onLoad={this.onThumbnailLoad}
                    onError={(error) => this.onImageError(error.nativeEvent.error)}
                />
            </View>
        );
    }

    renderImagePlaceHolder(placeHolderImg = null) {
        let placeHolderSrc = null;
        let placeHolderStyle = this.props.style;
        if (this.shouldRetry() || (this.props.placeHolder && (this.props.placeHolder === placeHolderTypes.CAROUSEL))) {
            placeHolderSrc = IMAGE_PLACEHOLDER_PLAIN_BACKGROUND;
            placeHolderStyle = [{ position: 'absolute' }, this.props.style];
        } else if (placeHolderImg) {
            placeHolderSrc = placeHolderImg;
        } else {
            placeHolderSrc = IMAGE_PLACEHOLDER_NO_MEDIA;
        }
        return (
            <Image
                resizeMode={'stretch'}
                key={this.props.key}
                style={placeHolderStyle}
                source={placeHolderSrc}
                onLoad={this.onLoadPlaceHolder}
            />
        );
    }

    onLoad() {
        Animated.timing(this.state.thumbnailOpacity, {
            toValue: 0,
            duration: 250
        }).start();
        this.setState({ loading: false});
    }

    onLoadPlaceHolder() {
        Animated.timing(this.state.thumbnailOpacity, {
            toValue: 0,
            duration: 250
        }).start();
        this.setState({ loading: false });
    }

    onThumbnailLoad() {
        Animated.timing(this.state.thumbnailOpacity, {
            toValue: 1,
            duration: 250
        }).start();

        this.setState({
            show: true
        });

    }

    renderBusy() {
        if (this.state.loading && this.props.renderLoading) {
            return this.props.renderLoading();
        }
    }

    onImageError(error) {
        console.log(`Loading image failed: ${error}`);
        LayoutAnimation.easeInEaseOut();
        this.setState({ hasImageFailed: true, loading: false });
    }

    shouldRetry() {
        return (this.props.retryOnError !== undefined) ? this.props.retryOnError : false;
    }
}


ProgressiveImage.propTypes = {
    imageUrl: React.PropTypes.string.isRequired,
    thumbnailUrl: React.PropTypes.string,
    renderLoading: React.PropTypes.func
}

ProgressiveImage.defaultProps = {
}

export default ProgressiveImage;