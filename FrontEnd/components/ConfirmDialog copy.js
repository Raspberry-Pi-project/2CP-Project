import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity 
} from 'react-native';

const ConfirmDialog = React.memo(({ visible, title, message, onCancel, onConfirm, cancelText, confirmText }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        // Prevent automatic closing on back button press
        console.log('Modal request close - prevented automatic closing');
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title || 'Confirm'}</Text>
          <Text style={styles.modalMessage}>
            {message || 'Are you sure you want to proceed?'}
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>{cancelText || 'Cancel'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>{confirmText || 'Confirm'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}, (prevProps, nextProps) => {
  // Only re-render when visibility or message actually changes
  return prevProps.visible === nextProps.visible && 
         prevProps.message === nextProps.message;
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#4a6da7',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
    ...Platform.select({
      ios: {
          fontFamily: 'System',
      },
      android: {
          fontFamily: 'Roboto',
          includeFontPadding: false, // Helps with text alignment issues
      }
  }),
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '500',
    ...Platform.select({
      ios: {
          fontFamily: 'System',
      },
      android: {
          fontFamily: 'Roboto',
          includeFontPadding: false, // Helps with text alignment issues
      }
  }),
  },
});

export default ConfirmDialog;