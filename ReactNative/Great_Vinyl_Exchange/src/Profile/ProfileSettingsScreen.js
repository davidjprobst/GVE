import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import * as _ from 'lodash';

import { ProfileInfoCell, InputField } from '../common-components';
import theme from '../styles/theme';
import { Style, em } from '../styles/styles';
import { updateUserProfile, updateProfileImage, fetchProfile } from './ProfileActions';

class ProfileSettingsScreen extends Component {

    state = {
        name: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        username: '', 
        profileImage: null,
        isEditing: false,
    }; 

    static navigationOptions = ({ navigation }) => { 
        const { headerRight } = !!navigation.state.params ? navigation.state.params : navigation.state;
        return {
            title: 'Settings',
            headerStyle: { backgroundColor: theme.primaryRed },
            headerTitleStyle: { color: theme.cream, fontFamily: 'WorkSans-SemiBold' },
            headerRight: !!headerRight && headerRight,
        };
    };

    constructor(props) {
        super(props)

        this._onProfileFormTapped = this._onProfileFormTapped.bind(this);
        this._profilePhotoTapped = this._profilePhotoTapped.bind(this);
    }

    componentWillMount() {
        this.props.fetchProfile();
        this.props.navigation.setParams(
            { headerRight: <TouchableOpacity
                            onPress={this._onProfileFormTapped}
                           >
                                <Text
                                    style={{ paddingRight: 17,
                                            color: theme.cream,
                                            fontSize: 17,
                                            fontFamily: 'WorkSans-Regular'
                                        }}
                                >Edit</Text>
                           </TouchableOpacity>
        });
    }

    componentWillReceiveProps(nextProps) {

        if (!!nextProps.userProfile) {
            this.setState({
                city: (!!nextProps.userProfile.address && !!nextProps.userProfile.address.city) ? nextProps.userProfile.address.city : null,
                state: (!!nextProps.userProfile.address && !!nextProps.userProfile.address.state) ? nextProps.userProfile.address.state : null, 
                street: (!!nextProps.userProfile.address && !!nextProps.userProfile.address.street) ? nextProps.userProfile.address.street : null,
                zipcode: (!!nextProps.userProfile.address && !!nextProps.userProfile.address.zipcode) ? nextProps.userProfile.address.zipcode : null,
                name: !!nextProps.userProfile.name ? nextProps.userProfile.name : null,
                username: !!nextProps.userProfile.username ? nextProps.userProfile.username : null,
                profileImage: !!nextProps.userProfile.profileImage ? nextProps.userProfile.profileImage : this.state.profileImage,
            })
        }
    }

    _onProfileFormTapped() {
        const { isEditing, name, username, street, city, state, zipcode, profileImage } = this.state;
        if (isEditing) {
            // This is when the user has clicked done for editing, and so we check to see
            // if any information has been changed, if it has we pop a save modal thing, and
            // make a firebase call to save the information on the back end
            //MVP make the firebase call
            this.props.updateUserProfile({ name, username, address: { street, city, state, zipcode }, profileImage });
            this.props.navigation.setParams(
            {
                headerRight: <TouchableOpacity
                                onPress={this._onProfileFormTapped}  
                             >
                                <Text
                                    style={{ paddingRight: 17,
                                            color: theme.cream,
                                            fontSize: 17,
                                            fontFamily: 'WorkSans-Regular'
                                        }}
                                >Edit</Text>
                            </TouchableOpacity>
            });
        } else {
            this.props.navigation.setParams(
            {
                headerRight: <TouchableOpacity
                               onPress={this._onProfileFormTapped}
                             >
                                <Text
                                    style={{ paddingRight: 17,
                                            color: theme.cream,
                                            fontSize: 17,
                                            fontFamily: 'WorkSans-Regular'
                                        }}
                                >Done</Text>
                           </TouchableOpacity>
            });
        }
        this.setState({ isEditing: !isEditing });
    }

    _profilePhotoTapped() {
      const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        storageOptions: {
          skipBackup: true
        }
      };

      let source = null
      const { name, username, street, city, state, zipcode } = this.state;
  
      ImagePicker.showImagePicker(options, (response) => {
  
        if (response.didCancel) {
          //console.log('User cancelled photo picker');
        }
        else if (response.error) {
          console.warn('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
          //console.log('User tapped custom button: ', response.customButton);
        }
        else {
          source = { uri: response.uri };
          this.setState({
            profileImage: source
          });
          this.props.updateProfileImage({ name, username, address: { street, city, state, zipcode }, profileImage: { uri: source.uri } });
          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        }
      });
    }

    _renderTitle() {
        return (
            <Text
                style={{ 
                    fontSize: 22, 
                    color: theme.primaryRed, 
                    paddingLeft: 16, 
                    paddingTop: 20,
                    fontWeight: '500',
                    fontFamily: 'WorkSans-SemiBold' }}
            >
                Profile
            </Text>
        );
    }

    _renderProfileImage() {
        let imageSource;
        if (!!this.state.profileImage && this.state.profileImage.downloadUrl) {
            imageSource = { uri: this.state.profileImage.downloadUrl };
        } else if (!!this.state.profileImage) {
            imageSource = this.state.profileImage;
        } 

        console.log(imageSource);
        let dimensions = !!imageSource ? 90 : 72;

        return (
            <View
              style={{ paddingTop: 20, paddingLeft: 16 }}>
              <TouchableOpacity onPress={this._profilePhotoTapped}>
                <Image 
                    resizeMode="contain"
                    style={{ width: dimensions, height: dimensions, borderRadius: 30 }}
                    source={!!imageSource ? imageSource : require('../resources/images/avatar-default.png')} 
                />
              </TouchableOpacity>
            </View>
        )
    }

    _renderNoInformationProvidedView() {
        return (
            <TouchableWithoutFeedback onPress={this._onProfileFormTapped}>
                <View style={{ paddingLeft: 21, paddingTop: 5 }}>
                    <ProfileInfoCell 
                        title="Name"
                        value="Add Name"
                        isEmpty={true} />
                    <ProfileInfoCell 
                        title="Preferred Shipping Address"
                        value="Add Address"
                        isEmpty={true} />
                    <ProfileInfoCell 
                        title="Discogs Username"
                        value="Add Username"
                        isEmpty={true} />
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _renderEditProfileView() {
        return (
            <View style={{ flex: .6, paddingHorizontal: 21, paddingTop: 10, flexDirection: 'column' }}>
                <InputField
                    onChangeText={name => this.setState({ name })}
                    onSubmitEditing={null}
                    placeholder={"Add Name"}
                    value={!!this.state.name ? !!this.state.name : ''}
                    label={"Full Name"}
                    showError={false}
                />
                 <InputField
                    onChangeText={street => this.setState({ street })}
                    onSubmitEditing={null}
                    placeholder={"Add Address"}
                    value={!!this.state.street ? !!this.state.street : ''}
                    label={"Preferred Shipping Address"}
                    showError={false}
                />
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ flex: 1 }}>
                        <InputField
                            style={{ flex: 1, width: '100%'}}
                            onChangeText={city => this.setState({ city })}
                            onSubmitEditing={null}
                            placeholder={"Add City"}
                            value={!!this.state.city ? !!this.state.city : ''}
                            label={"City"}
                            showError={false}
                        />
                    </View>
                    <View style={{ paddingLeft: 18 }}>
                        <InputField
                            style={{ flex: 1, width: '100%'}}
                            onChangeText={state => this.setState({ state })}
                            onSubmitEditing={null}
                            placeholder={"Add State"}
                            value={!!this.state.state ? !!this.state.state : ''}
                            label={"State (Abbr.)"}
                            showError={false}
                        />
                    </View>
                    <View style={{ paddingLeft: 25 }}>
                    <InputField
                        style={{ flex: 1, width: '100%'}}
                        onChangeText={zipcode => this.setState({ zipcode })}
                        onSubmitEditing={null}
                        placeholder={"Add ZIP"}
                        value={!!this.state.zipcode ? !!this.state.zipcode : ''}
                        label={"ZIP code"}
                        showError={false}
                        keyboardType='numeric'
                    /> 
                    </View>
                </View>
                <InputField
                    onChangeText={username => this.setState({ username })}
                    onSubmitEditing={null}
                    placeholder={"Add Username"}
                    value={!!this.state.username ? !!this.state.username : ''}
                    label={"Discogs Username"}
                    showError={false}
                /> 
            </View>
        );
    }

    _renderProfileView() {
        console.log('im here');
        return (
            <View style={{ paddingLeft: 21, paddingTop: 5 }}>
                <ProfileInfoCell 
                    title="Name"
                    value={ !!this.props.userProfile.name ? this.props.userProfile.name : '' }
                    isEmpty={false} />
                <ProfileInfoCell 
                    title="Preferred Shipping Address"
                    value={ !!this.props.userProfile.address 
                            ? `${this.props.userProfile.address.street}
                            \n${this.props.userProfile.address.city},  ${this.props.userProfile.address.state},  ${this.props.userProfile.address.zipcode}`
                            : '' }
                    isEmpty={false} />
                <ProfileInfoCell 
                    title="Discogs Username"
                    value={ !!this.props.userProfile.username ? this.props.userProfile.username : '' }
                    isEmpty={false} />
            </View>
        );
    }
  
    render() {
        console.log(this.state);
        console.log(this.props.userProfile);
        let renderForm = null;
        if (this.state.isEditing) {
            renderForm = this._renderEditProfileView();
        } else if (typeof this.props.userProfile !== 'undefined'){
            const shouldShowProfile = this.props.userProfile !== null 
                                      && this.props.userProfile.name !== null 
                                      && (!!this.props.userProfile.address &&  !!this.props.userProfile.address !== null) 
                                      && this.props.userProfile.address.city !== null 
                                      && this.props.userProfile.username !== null;
            if (shouldShowProfile) {
                renderForm = this._renderProfileView();
            } else {
                renderForm = this._renderNoInformationProvidedView();
            }
        }

        return (
            <View style={{ flex: 1, backgroundColor: theme.cream }}>
                {this._renderTitle()}
                {this._renderProfileImage()}
                {renderForm} 
            </View>
        );
    }
}

const mapStateToProps = state => {
    return { userProfile: state.profile.userProfile };
};

export default connect(mapStateToProps, { updateUserProfile, updateProfileImage, fetchProfile })(ProfileSettingsScreen);