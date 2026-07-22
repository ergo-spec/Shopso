import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StaffStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<StaffStackParamList, 'CreateEntry'>;
type ScreenRouteProp = RouteProp<StaffStackParamList, 'CreateEntry'>;

// Sample Catalog Items List
interface CatalogItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  unitPrice: number;
  stockQty: number;
  unit: string;
}

// Preset Contact Item (Vendor / Partner)
interface PresetContact {
  id: string;
  name: string;
  type: 'vendor' | 'partner';
  subText: string;
  phone: string;
}

const SAMPLE_CATALOG_ITEMS: CatalogItem[] = [
  { id: '1', name: 'Cotton Crew Neck T-Shirt (Large)', category: 'Apparel', sku: 'TSH-L-01', unitPrice: 499, stockQty: 45, unit: 'Pcs' },
  { id: '2', name: 'Slim Fit Denim Jeans (Size 32)', category: 'Apparel', sku: 'JNS-32-02', unitPrice: 1299, stockQty: 28, unit: 'Pcs' },
  { id: '3', name: 'Wireless Noise Cancelling Earbuds', category: 'Electronics', sku: 'EAR-BT-03', unitPrice: 2499, stockQty: 12, unit: 'Pcs' },
  { id: '4', name: 'Premium Leather Wallet (Brown)', category: 'Accessories', sku: 'WAL-BR-04', unitPrice: 799, stockQty: 18, unit: 'Pcs' },
  { id: '5', name: 'Stainless Steel Water Bottle (1L)', category: 'Accessories', sku: 'BTL-SS-05', unitPrice: 350, stockQty: 60, unit: 'Pcs' },
  { id: '6', name: 'Store Electricity Bill Payment', category: 'Utilities', sku: 'UTL-ELE-06', unitPrice: 3500, stockQty: 99, unit: 'Service' },
  { id: '7', name: 'Office Staff Refreshments & Snacks', category: 'Expenses', sku: 'EXP-SNK-07', unitPrice: 250, stockQty: 99, unit: 'Expense' },
  { id: '8', name: 'Monthly Store Commercial Rent', category: 'Expenses', sku: 'EXP-RNT-08', unitPrice: 15000, stockQty: 99, unit: 'Service' },
];

const PRESET_VENDORS_AND_PARTNERS: PresetContact[] = [
  { id: 'v1', name: 'Apex Wholesalers & Distributors', type: 'vendor', subText: 'Apparel & Goods Supplier', phone: '+91 98765 43210' },
  { id: 'v2', name: 'Metro Garments Supply Co.', type: 'vendor', subText: 'Clothing Manufacturer', phone: '+91 98111 22233' },
  { id: 'v3', name: 'Global Tech Imports Ltd.', type: 'vendor', subText: 'Electronics Distributor', phone: '+91 97444 55566' },
  { id: 'v4', name: 'City Print & Packaging Works', type: 'vendor', subText: 'Packaging & Labels Vendor', phone: '+91 96333 44455' },
  { id: 'v5', name: 'Sunrise Logistics & Freight', type: 'vendor', subText: 'Transport & Delivery Vendor', phone: '+91 95222 11100' },
  { id: 'p1', name: 'Rahul Sharma', type: 'partner', subText: 'Managing Partner (40% Stake)', phone: '+91 98222 33344' },
  { id: 'p2', name: 'Vikram Patel', type: 'partner', subText: 'Investor Partner (30% Stake)', phone: '+91 97111 00099' },
  { id: 'p3', name: 'Ananya Gupta', type: 'partner', subText: 'Operating Partner (30% Stake)', phone: '+91 96555 88877' },
  { id: 'p4', name: 'Siddharth Verma', type: 'partner', subText: 'Silent Partner', phone: '+91 95444 77766' },
];

export const CreateEntryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();

  const initialCategory = route.params?.category || 'transaction';
  const activeSubType = route.params?.subType || 'Expense';

  // Form State
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('Cash (Drawer)');
  const [isSplitPayment, setIsSplitPayment] = useState(false);
  const [secondaryAccount, setSecondaryAccount] = useState('HDFC (UPI)');
  const [secondaryAmount, setSecondaryAmount] = useState('');

  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [selectedContact, setSelectedContact] = useState<PresetContact | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [rate, setRate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Item Search Modal State
  const [isItemPickerVisible, setIsItemPickerVisible] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('All');

  // Contact Search Modal State (Vendor / Partner)
  const [isContactPickerVisible, setIsContactPickerVisible] = useState(false);
  const [contactSearchQuery, setContactSearchQuery] = useState('');

  // Robust Case-Insensitive Catalog Filter
  const filteredCatalogItems = useMemo(() => {
    return SAMPLE_CATALOG_ITEMS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(itemSearchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(itemSearchQuery.toLowerCase());
      const matchesCategory =
        selectedFilterCategory === 'All' ||
        item.category.toLowerCase() === selectedFilterCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [itemSearchQuery, selectedFilterCategory]);

  // Filter Preset Contacts
  const filteredContacts = useMemo(() => {
    const isPartnerCategory = initialCategory.toLowerCase() === 'partner';
    const targetType = isPartnerCategory ? 'partner' : 'vendor';

    return PRESET_VENDORS_AND_PARTNERS.filter((c) => {
      const matchesType = c.type === targetType;
      const matchesQuery =
        c.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
        c.subText.toLowerCase().includes(contactSearchQuery.toLowerCase());
      return matchesType && matchesQuery;
    });
  }, [initialCategory, contactSearchQuery]);

  // Compact Shop Accounts List
  const accounts = [
    { id: 'cash', name: 'Cash (Drawer)', icon: 'wallet-outline' },
    { id: 'hdfc', name: 'HDFC (UPI)', icon: 'card-outline' },
    { id: 'icici', name: 'ICICI Bank', icon: 'business-outline' },
    { id: 'paytm', name: 'Paytm QR', icon: 'qr-code-outline' },
    { id: 'petty', name: 'Petty Cash', icon: 'archive-outline' },
  ];

  const handleSelectItem = (item: CatalogItem) => {
    setSelectedItem(item);
    setRate(item.unitPrice.toString());
    const calculatedAmount = item.unitPrice * (parseFloat(quantity) || 1);
    setAmount(calculatedAmount.toString());
    setIsItemPickerVisible(false);
  };

  const handleSelectContact = (contact: PresetContact) => {
    setSelectedContact(contact);
    setIsContactPickerVisible(false);
  };

  const handleQuantityChange = (newQtyStr: string) => {
    setQuantity(newQtyStr);
    const newQty = parseFloat(newQtyStr) || 0;
    const currentRate = parseFloat(rate) || (selectedItem ? selectedItem.unitPrice : 0);
    if (currentRate > 0) {
      setAmount((newQty * currentRate).toString());
    }
  };

  const handleSaveEntry = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than ₹0');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert('Entry Saved', `${activeSubType} entry of ₹${amount} saved successfully!`, [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }, 600);
  };

  const isPartnerCategory = initialCategory.toLowerCase() === 'partner';
  const contactSectionLabel = isPartnerCategory ? 'SELECT PARTNER' : 'SELECT VENDOR';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Pure White Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{activeSubType} Entry</Text>
          <Text style={styles.headerSubtitle}>{initialCategory.toUpperCase()}</Text>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={() => { setAmount(''); setSelectedItem(null); setSelectedContact(null); setSecondaryAmount(''); }}>
          <Text style={styles.resetButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* SECTION 1: AMOUNT & FIRST ACCOUNT CARD */}
        <View style={styles.formSection}>
          <Text style={styles.sectionHeading}>
            {isSplitPayment ? 'FIRST ACCOUNT' : 'AMOUNT'}
          </Text>

          <View style={styles.standardInputCard}>
            {/* Row 1: Right-Aligned Amount Input (Keyboard off by default) */}
            <View style={styles.standardInputRow}>
              <Text style={styles.miniLabel}>Amount:</Text>
              <View style={styles.openInputRightGroup}>
                <Text style={styles.subtleGreyCurrencySymbol}>₹</Text>
                <TextInput
                  style={styles.rightAlignedAmountInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor="#94a3b8"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Row 2: Payment Account Selector Chips Below Amount */}
            <View style={styles.accountSelectorContainer}>
              <Text style={styles.subtleAccountLabel}>PAYMENT ACCOUNT</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.compactAccountChipsScroll}>
                {accounts.map((acc) => {
                  const isSelected = selectedAccount === acc.name;
                  return (
                    <TouchableOpacity
                      key={acc.id}
                      style={[
                        styles.compactAccountChip,
                        isSelected && styles.compactAccountChipSelected,
                      ]}
                      onPress={() => setSelectedAccount(acc.name)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={acc.icon as any}
                        size={14}
                        color={isSelected ? '#e70b24' : '#64748b'}
                      />
                      <Text
                        style={[
                          styles.compactAccountChipText,
                          isSelected && styles.compactAccountChipTextSelected,
                        ]}
                      >
                        {acc.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>

        {/* SECTION 2: SPLIT PAYMENT TOGGLE CARD (BELOW AMOUNT & ACCOUNT) */}
        <View style={styles.formSection}>
          <View style={styles.topSplitPaymentCard}>
            <View style={styles.splitPaymentHeaderRow}>
              <View style={styles.splitPaymentTitleGroup}>
                <Ionicons name="swap-horizontal-outline" size={16} color="#0284c7" />
                <Text style={styles.splitPaymentHeadingText}>Split Payment</Text>
              </View>

              {/* Custom Smooth Pill Switch Component */}
              <TouchableOpacity
                style={[
                  styles.customPillSwitchTrack,
                  isSplitPayment && styles.customPillSwitchTrackActive,
                ]}
                onPress={() => setIsSplitPayment(!isSplitPayment)}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.customPillSwitchThumb,
                    isSplitPayment && styles.customPillSwitchThumbActive,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* SECTION 3: SECOND ACCOUNT (SHOWN WHEN SPLIT PAYMENT IS ON) */}
        {isSplitPayment && (
          <View style={styles.formSection}>
            <Text style={styles.sectionHeading}>SECOND ACCOUNT</Text>

            <View style={styles.standardInputCard}>
              <View style={styles.secondAccountSelectorContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.compactAccountChipsScroll}>
                  {accounts.map((acc) => {
                    const isSelected = secondaryAccount === acc.name;
                    return (
                      <TouchableOpacity
                        key={`sec-${acc.id}`}
                        style={[
                          styles.compactAccountChip,
                          isSelected && styles.compactAccountChipSelected,
                        ]}
                        onPress={() => setSecondaryAccount(acc.name)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={acc.icon as any}
                          size={14}
                          color={isSelected ? '#0284c7' : '#64748b'}
                        />
                        <Text
                          style={[
                            styles.compactAccountChipText,
                            isSelected && { color: '#0284c7', fontWeight: '700' },
                          ]}
                        >
                          {acc.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={styles.openSplitAmountRow}>
                <Text style={styles.miniLabel}>Amount:</Text>
                <View style={styles.openInputRightGroup}>
                  <Text style={styles.subtleGreyCurrencySymbol}>₹</Text>
                  <TextInput
                    style={styles.openSplitAmountTextInput}
                    value={secondaryAmount}
                    onChangeText={setSecondaryAmount}
                    placeholder="0.00"
                    placeholderTextColor="#94a3b8"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* SECTION 4: SEARCHABLE ITEM PICKER (Catalog List) */}
        <View style={styles.formSection}>
          <Text style={styles.sectionHeading}>SELECT ITEM / CATALOG</Text>

          {!selectedItem ? (
            <TouchableOpacity
              style={styles.itemPickerTriggerButton}
              onPress={() => setIsItemPickerVisible(true)}
              activeOpacity={0.85}
            >
              <View style={styles.itemPickerTriggerLeft}>
                <Ionicons name="search-outline" size={18} color="#e70b24" />
                <Text style={styles.itemPickerTriggerText}>
                  Tap to search & pick item...
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ) : (
            /* Selected Item Card with Semi-Bold Title */
            <View style={styles.selectedItemCard}>
              <View style={styles.selectedItemHeader}>
                <View style={styles.selectedItemTextContainer}>
                  <Text style={styles.selectedItemName}>{selectedItem.name}</Text>
                  <Text style={styles.selectedItemSku}>
                    SKU: {selectedItem.sku} • Category: {selectedItem.category}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.changeItemButton}
                  onPress={() => setIsItemPickerVisible(true)}
                >
                  <Text style={styles.changeItemButtonText}>Change</Text>
                </TouchableOpacity>
              </View>

              {/* Quantity & Rate Row */}
              <View style={styles.inventoryMultiRow}>
                <View style={[styles.inputRow, { flex: 1 }]}>
                  <Text style={styles.miniLabel}>Qty:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={quantity}
                    onChangeText={handleQuantityChange}
                    keyboardType="number-pad"
                    placeholder="1"
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View style={styles.innerVerticalDivider} />

                <View style={[styles.inputRow, { flex: 1.5 }]}>
                  <Text style={styles.miniLabel}>Rate (<Text style={styles.subtleGreyCurrencySymbol}>₹</Text>):</Text>
                  <TextInput
                    style={styles.textInput}
                    value={rate}
                    onChangeText={(newRate) => {
                      setRate(newRate);
                      const r = parseFloat(newRate) || 0;
                      const q = parseFloat(quantity) || 1;
                      setAmount((r * q).toString());
                    }}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* SECTION 5: PRESET VENDOR / PARTNER PICKER */}
        <View style={styles.formSection}>
          <Text style={styles.sectionHeading}>{contactSectionLabel}</Text>

          {!selectedContact ? (
            <TouchableOpacity
              style={styles.itemPickerTriggerButton}
              onPress={() => setIsContactPickerVisible(true)}
              activeOpacity={0.85}
            >
              <View style={styles.itemPickerTriggerLeft}>
                <Ionicons
                  name={isPartnerCategory ? 'people-outline' : 'storefront-outline'}
                  size={18}
                  color="#7c3aed"
                />
                <Text style={styles.itemPickerTriggerText}>
                  Tap to search & pick {isPartnerCategory ? 'partner' : 'vendor'}...
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ) : (
            /* Selected Contact Card with Semi-Bold Title */
            <View style={styles.selectedItemCard}>
              <View style={styles.selectedItemHeader}>
                <View style={styles.selectedItemTextContainer}>
                  <Text style={styles.selectedItemName}>{selectedContact.name}</Text>
                  <Text style={styles.selectedItemSku}>
                    {selectedContact.subText} • {selectedContact.phone}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.changeItemButton}
                  onPress={() => setIsContactPickerVisible(true)}
                >
                  <Text style={styles.changeItemButtonText}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* SECTION 6: NOTES & REMARKS */}
        <View style={styles.formSection}>
          <Text style={styles.sectionHeading}>ADDITIONAL NOTES</Text>

          <View style={styles.inputCard}>
            <View style={[styles.inputRow, { alignItems: 'flex-start' }]}>
              <Ionicons name="document-text-outline" size={18} color="#64748b" style={[styles.inputIcon, { marginTop: 4 }]} />
              <TextInput
                style={[styles.textInput, styles.multilineTextInput]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any bill number or internal note..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FIXED BOTTOM ACTION BAR */}
      <View style={[styles.bottomActionBar, { paddingBottom: Math.max(insets.bottom + 12, 16) }]}>
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSaveEntry}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color="#ffffff" />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Saving Entry...' : `Save ${activeSubType} Entry`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* SEARCHABLE ITEM SELECTION MODAL */}
      <Modal
        visible={isItemPickerVisible}
        animationType="slide"
        onRequestClose={() => { setIsItemPickerVisible(false); setItemSearchQuery(''); setSelectedFilterCategory('All'); }}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>Select Item</Text>
            <TouchableOpacity onPress={() => { setIsItemPickerVisible(false); setItemSearchQuery(''); setSelectedFilterCategory('All'); }} style={{ padding: 4 }}>
              <Ionicons name="close" size={24} color="#0f172a" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={20} color="#64748b" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              value={itemSearchQuery}
              onChangeText={setItemSearchQuery}
              placeholder="Search item name or SKU..."
              placeholderTextColor="#94a3b8"
              autoFocus={false}
            />
            {itemSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setItemSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Optimized Category Filter Pill Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipsRow}>
            {['All', 'Apparel', 'Electronics', 'Accessories', 'Expenses', 'Utilities'].map((cat) => {
              const isSelected = selectedFilterCategory.toLowerCase() === cat.toLowerCase();
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedFilterCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected && styles.filterChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <FlatList
            data={filteredCatalogItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.itemListContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itemRowCard}
                onPress={() => handleSelectItem(item)}
                activeOpacity={0.7}
              >
                <View style={styles.itemRowLeft}>
                  <View style={styles.itemAvatar}>
                    <Ionicons name="cube" size={18} color="#0284c7" />
                  </View>
                  <View style={styles.itemRowTextContainer}>
                    <Text style={styles.itemRowName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemRowMeta}>
                      SKU: {item.sku} • Stock: {item.stockQty} {item.unit}
                    </Text>
                  </View>
                </View>

                <View style={styles.itemRowRight}>
                  <Text style={styles.itemRowPrice}>
                    <Text style={styles.subtleGreyCurrencySymbol}>₹</Text>{item.unitPrice}
                  </Text>
                  <Ionicons name="add-circle" size={22} color="#e70b24" />
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptySearchBox}>
                <Ionicons name="search-outline" size={32} color="#cbd5e1" />
                <Text style={styles.emptySearchTitle}>No items found</Text>
                <Text style={styles.emptySearchSubtitle}>Try a different search query or category filter.</Text>
              </View>
            }
          />
        </View>
      </Modal>

      {/* SEARCHABLE VENDOR / PARTNER SELECTION MODAL */}
      <Modal
        visible={isContactPickerVisible}
        animationType="slide"
        onRequestClose={() => { setIsContactPickerVisible(false); setContactSearchQuery(''); }}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>
              Select {isPartnerCategory ? 'Partner' : 'Vendor'}
            </Text>
            <TouchableOpacity onPress={() => { setIsContactPickerVisible(false); setContactSearchQuery(''); }} style={{ padding: 4 }}>
              <Ionicons name="close" size={24} color="#0f172a" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={20} color="#64748b" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              value={contactSearchQuery}
              onChangeText={setContactSearchQuery}
              placeholder={`Search ${isPartnerCategory ? 'partner' : 'vendor'} name or phone...`}
              placeholderTextColor="#94a3b8"
              autoFocus={false}
            />
            {contactSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setContactSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredContacts}
            keyExtractor={(c) => c.id}
            contentContainerStyle={styles.itemListContent}
            renderItem={({ item: contact }) => (
              <TouchableOpacity
                style={styles.itemRowCard}
                onPress={() => handleSelectContact(contact)}
                activeOpacity={0.7}
              >
                <View style={styles.itemRowLeft}>
                  <View style={[styles.itemAvatar, { backgroundColor: isPartnerCategory ? '#f3e8ff' : '#fef3c7' }]}>
                    <Ionicons
                      name={isPartnerCategory ? 'person' : 'storefront'}
                      size={18}
                      color={isPartnerCategory ? '#7c3aed' : '#b45309'}
                    />
                  </View>
                  <View style={styles.itemRowTextContainer}>
                    <Text style={styles.itemRowName}>{contact.name}</Text>
                    <Text style={styles.itemRowMeta}>
                      {contact.subText} • {contact.phone}
                    </Text>
                  </View>
                </View>

                <Ionicons name="checkmark-circle-outline" size={22} color="#059669" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptySearchBox}>
                <Ionicons name="people-outline" size={32} color="#cbd5e1" />
                <Text style={styles.emptySearchTitle}>
                  No {isPartnerCategory ? 'partners' : 'vendors'} found
                </Text>
                <Text style={styles.emptySearchSubtitle}>Try searching with a different name or phone number.</Text>
              </View>
            }
          />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    marginTop: 1,
  },
  resetButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resetButtonText: {
    color: '#e70b24',
    fontSize: 13,
    fontWeight: '600',
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 110,
    gap: 12,
  },

  /* Standard Input Card with Amount Row First & Account Chips Second */
  standardInputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  standardInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtleGreyCurrencySymbol: {
    fontSize: 15,
    fontWeight: '400',
    color: '#94a3b8', // Subtle Grey Regular Weight
    marginRight: 4,
  },
  openInputRightGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 8,
  },
  rightAlignedAmountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'right',
    paddingVertical: 0,
    paddingHorizontal: 2,
  },

  accountSelectorContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
    gap: 6,
  },
  secondAccountSelectorContainer: {
    gap: 6,
  },
  subtleAccountLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },

  /* Form Sections */
  formSection: {
    gap: 6,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.8,
    marginLeft: 2,
  },

  /* Top Split Payment Toggle Card */
  topSplitPaymentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  splitPaymentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  splitPaymentTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  splitPaymentHeadingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },

  /* Custom Smooth Pill Switch */
  customPillSwitchTrack: {
    width: 40,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#e2e8f0',
    padding: 2,
    justifyContent: 'center',
  },
  customPillSwitchTrackActive: {
    backgroundColor: '#0284c7',
  },
  customPillSwitchThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  customPillSwitchThumbActive: {
    alignSelf: 'flex-end',
  },

  /* Compact Payment Account Chips Scroll */
  compactAccountChipsScroll: {
    flexDirection: 'row',
  },
  compactAccountChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
    gap: 6,
  },
  compactAccountChipSelected: {
    borderColor: '#e70b24',
    backgroundColor: '#fff5f5',
  },
  compactAccountChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  compactAccountChipTextSelected: {
    color: '#e70b24',
    fontWeight: '700',
  },

  /* Open Split Amount Row (No Box Border) */
  openSplitAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
    marginTop: 4,
  },
  openSplitAmountTextInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'right',
    paddingVertical: 0,
    paddingHorizontal: 2,
  },

  /* Item Picker Trigger Button */
  itemPickerTriggerButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemPickerTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemPickerTriggerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },

  /* Selected Item & Contact Card with Semi-Bold Titles */
  selectedItemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
  },
  selectedItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedItemTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  selectedItemName: {
    fontSize: 14,
    fontWeight: '600', // Semi-Bold Item / Vendor / Partner Name
    color: '#0f172a',
  },
  selectedItemSku: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  changeItemButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  changeItemButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e70b24',
  },

  /* Inputs Cards */
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '500',
    padding: 0,
  },
  multilineTextInput: {
    height: 54,
    textAlignVertical: 'top',
  },

  inventoryMultiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 10,
    paddingTop: 8,
  },
  miniLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginRight: 6,
  },
  innerVerticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 10,
  },

  /* Fixed Bottom Action Bar */
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  submitButton: {
    backgroundColor: '#e70b24',
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#e70b24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Searchable Item Modal Styles */
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  filterChipsRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexGrow: 0,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: '#e70b24',
    borderColor: '#e70b24',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  itemListContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  itemRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  itemRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  itemAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemRowTextContainer: {
    flex: 1,
  },
  itemRowName: {
    fontSize: 14,
    fontWeight: '600', // Semi-Bold Catalog Item / Contact Name
    color: '#0f172a',
    lineHeight: 18,
  },
  itemRowMeta: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 16,
  },
  itemRowRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
    minWidth: 70,
  },
  itemRowPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  emptySearchBox: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySearchTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    marginTop: 8,
  },
  emptySearchSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
  },
});
