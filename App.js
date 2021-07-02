import React, {useState} from 'react';
import {RNCamera} from 'react-native-camera';
import {
  SafeAreaView,
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';

const App = () => {
  const [barcode, setBarcode] = useState(null);
  const [response, setResponse] = useState({isError: false, data: {}});

  const fetchDetailsFromApi = async data => {
    try {
      let res = await fetch(`https://randomuser.me/api/?seed=${data}`);
      console.log(res.ok);
      if (res.ok) {
        res = await res.json();
        setResponse({
          isError: false,
          data: res.results[0],
        });
      } else {
        setResponse({isError: true, data: {}});
      }
    } catch (e) {
      console.error('An error occurred while calling api', e);
      setResponse({isError: true, data: {}});
    }
  };
  return (
    <SafeAreaView>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Scan a barcode to find a product!
        </Text>
        {barcode === null ? (
          <RNCamera
            style={styles.fullWidth}
            onBarCodeRead={detectedBarcode => {
              setBarcode(detectedBarcode);
              setResponse({...response, isLoading: true});
              fetchDetailsFromApi(detectedBarcode.data);
            }}>
            <BarcodeMask
              edgeRadius={25}
              edgeColor="#808080"
              width={300}
              height={150}
              edgeWidth={50}
              edgeHeight={50}
              backgroundColor="transparent"
              outerMaskOpacity={0.2}
              animatedLineColor="rgb(255,0,0)"
              animatedLineWidth="100%"
              edgeBorderWidth={5}
            />
          </RNCamera>
        ) : (
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setBarcode(null);
                setResponse({isLoading: false, data: {}});
              }}>
              <TouchableOpacity
                style={styles.centeredView}
                onPress={() => {
                  setBarcode(null);
                  setResponse({isLoading: false, data: {}});
                }}>
                <TouchableWithoutFeedback
                  style={styles.centeredView}
                  onPress={() => {
                    setBarcode(null);
                    setResponse({isLoading: false, data: {}});
                  }}>
                  <View style={styles.modalView}>
                    {response.isError ? (
                      <Text
                        style={{
                          ...styles.strongText,
                          ...styles.errorText,
                        }}>
                        Aww! Snap! Can't find the product :(
                      </Text>
                    ) : (
                      <>
                        <View style={styles.profileContainer}>
                          <Image
                            style={styles.pictureContainer}
                            source={{
                              uri: response?.data?.picture?.large,
                            }}
                          />
                          <Text
                            style={styles.name}
                            numberOfLines={2}
                            ellipsizeMode="tail">
                            {`${response?.data?.name?.title || ''} ${
                              response?.data?.name?.first || ''
                            } ${response?.data?.name?.last || ''}`}
                          </Text>
                        </View>
                        <Text style={styles.strongText}>
                          Email :{' '}
                          <Text style={styles.italicText}>
                            {response?.data?.email || ''}
                          </Text>
                        </Text>
                        <Text style={styles.strongText}>
                          Date of Birth :{' '}
                          <Text style={styles.italicText}>
                            {new Date(
                              response?.data?.dob?.date,
                            ).toDateString() || ''}
                          </Text>
                        </Text>
                        <Text style={styles.strongText}>
                          Age :{' '}
                          <Text style={styles.italicText}>
                            {`${response?.data?.dob?.age || ''} years old`}
                          </Text>
                        </Text>
                        <Text style={styles.strongText}>
                          Cell number :{' '}
                          <Text style={styles.italicText}>
                            {response?.data?.cell || ''}
                          </Text>
                        </Text>
                        <Text style={styles.strongText}>
                          Address :{' '}
                          <Text style={styles.italicText}>
                            {`${response?.data?.location?.city || ''}, ${
                              response?.data.location?.state || ''
                            }, ${response?.data?.location?.country || ''}, ${
                              response?.data?.location?.postcode || ''
                            }`}
                          </Text>
                        </Text>
                        <Text style={styles.strongText}>
                          Timezone :{' '}
                          <Text style={styles.italicText}>
                            {`${response?.data?.location?.timezone?.description} (${response?.data.location?.timezone?.offset})`}
                          </Text>
                        </Text>
                      </>
                    )}
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => {
                        setBarcode(null);
                        setResponse({isLoading: false, data: {}});
                      }}>
                      <Text style={styles.textStyle}>Scan another profile</Text>
                    </Pressable>
                  </View>
                </TouchableWithoutFeedback>
              </TouchableOpacity>
            </Modal>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    height: '110%',
  },
  fullWidth: {
    flex: 1,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Cochin',
    textDecorationLine: 'underline',
    textDecorationColor: '#000',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 27,
    width: '100%',
  },
  modalView: {
    position: 'absolute',
    bottom: -20,
    height: '65%',
    width: '100%',
    margin: 10,
    backgroundColor: 'rgba(0,0,255,0.2)',
    borderRadius: 50,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  errorText: {
    color: '#f00',
    textAlign: 'center',
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  pictureContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#000',
    padding: 10,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Cochin',
    fontWeight: '700',
    textAlign: 'center',
    width: '50%',
  },
  strongText: {
    fontWeight: '600',
    fontSize: 16,
    margin: 10,
    fontFamily: 'arial',
  },
  italicText: {
    fontStyle: 'italic',
    fontWeight: '500',
    fontSize: 16,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    margin: 25,
  },
  textStyle: {
    color: 'rgba(255,255,255,0.75)',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
