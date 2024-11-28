import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Quote } from '../types/quote';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    backgroundColor: '#f3f4f6',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  column: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 5,
  },
  tableCell: {
    flex: 1,
  },
  total: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  terms: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f3f4f6',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280',
  },
});

interface Props {
  quote: Quote;
}

export default function QuotePDF({ quote }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src="/brl-logo.png" style={styles.logo} />
          <View>
            <Text>Quote Reference: {quote.reference}</Text>
            <Text>Date: {format(new Date(quote.createdAt), 'PP')}</Text>
            <Text>Valid Until: {format(new Date(quote.validity.validUntil), 'PP')}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {quote.type === 'air' ? 'Air Freight' : 'Ocean Freight'} Quote
        </Text>

        {/* Parties */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Shipper</Text>
              <Text>{quote.shipper.company}</Text>
              <Text>{quote.shipper.name}</Text>
              <Text>{quote.shipper.email}</Text>
              <Text>{quote.shipper.phone}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Consignee</Text>
              <Text>{quote.consignee.company}</Text>
              <Text>{quote.consignee.name}</Text>
              <Text>{quote.consignee.email}</Text>
              <Text>{quote.consignee.phone}</Text>
            </View>
          </View>
        </View>

        {/* Route */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route Details</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Origin:</Text>
              <Text>{quote.origin.name}</Text>
              <Text>{quote.origin.city}, {quote.origin.country}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Destination:</Text>
              <Text>{quote.destination.name}</Text>
              <Text>{quote.destination.city}, {quote.destination.country}</Text>
            </View>
          </View>
        </View>

        {/* Cargo Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cargo Details</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { flex: 2 }]}>Description</Text>
              <Text style={styles.tableCell}>Pieces</Text>
              <Text style={styles.tableCell}>Weight</Text>
              <Text style={styles.tableCell}>Volume</Text>
            </View>
            {quote.cargoDetails.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{item.description}</Text>
                <Text style={styles.tableCell}>{item.pieces}</Text>
                <Text style={styles.tableCell}>{item.grossWeight} kg</Text>
                <Text style={styles.tableCell}>{item.volume} m³</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Costs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Charges</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { flex: 2 }]}>Description</Text>
              <Text style={styles.tableCell}>Unit</Text>
              <Text style={styles.tableCell}>Quantity</Text>
              <Text style={styles.tableCell}>Amount</Text>
              <Text style={styles.tableCell}>Total</Text>
            </View>
            {quote.costs.map((cost, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{cost.description}</Text>
                <Text style={styles.tableCell}>{cost.unit}</Text>
                <Text style={styles.tableCell}>{cost.quantity}</Text>
                <Text style={styles.tableCell}>
                  {quote.currency} {cost.amount.toFixed(2)}
                </Text>
                <Text style={styles.tableCell}>
                  {quote.currency} {(cost.amount * (cost.quantity || 1)).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.total}>
            <Text>Subtotal: {quote.currency} {quote.subtotal.toFixed(2)}</Text>
            <Text>Taxes: {quote.currency} {quote.taxes.toFixed(2)}</Text>
            <Text style={{ fontWeight: 'bold' }}>
              Total: {quote.currency} {quote.total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Terms & Conditions */}
        <View style={styles.terms}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          {quote.terms.map((term, index) => (
            <Text key={index}>• {term}</Text>
          ))}
        </View>

        {/* Notes */}
        {quote.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <Text>{quote.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          BRL Global Logistics • www.brlglobal.com • +1 234 567 8900
        </Text>
      </Page>
    </Document>
  );
}