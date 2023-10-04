import {
  Document,
  Text,
  View,
  Page,
  PDFViewer,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';

Font.register({
  family: 'Arial',
  fonts: [
    { src: '/fonts/Bodoni.ttf' },
    { src: '/fonts/BodoniBold.ttf', fontWeight: 'bold' },
  ],
});
const styles = StyleSheet.create({
  page: {
    width: '100%',
    fontFamily: 'Arial',
    fontSize: '12px',
    display: 'none',
    paddingTop: 40,
    paddingHorizontal: 40,
    paddingBottom: 69,
  },
  headTI: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textHead: {
    fontSize: 13,
    fontWeight: 'light',
    letterSpacing: 2,
  },
  tableHead: {
    border: '1px solid #000',
    paddingHorizontal: 30,
    paddingVertical: 5,
  },
  tableHeadTwo: {
    display: 'flex',
    flexDirection: 'row',
    border: '1px solid #000',
  },
  tableOnTwo: {
    fontSize: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  imageLogo: {
    width: 180,
    height: 70,
  },
  textTable: {
    textAlign: 'center',
    fontSize: 30,
    letterSpacing: 2,
  },
  textInTable: {
    fontSize: 14,
  },
  tableInLeft: {
    border: '1px solid #000',
    paddingLeft: '18',
    paddingRight: '5',
  },
  tableRight: {
    width: '100%',
    paddingRight: '3',
  },
  marginTable: {
    marginTop: '30',
    fontSize: 10,
    border: '1px solid #000',
  },
  tableUnder: {
    width: '100%',
    backgroundColor: '#5a75d7',
    borderBottom: '1px solid #000',
  },
  textTableHead: {
    paddingVertical: '2',
    paddingHorizontal: 5,
  },
  TableHeadBody: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: '2',
    paddingHorizontal: 5,
  },
  tableRow: {
    borderRight: '1px solid #000',
  },
});

type QuotationPdfProps = {
  // rows: RequestItemDetailWithItem[];
};

const QuotationPdf: React.FC<QuotationPdfProps> = () => {
  return (
    <PDFViewer className="h-screen w-full">
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.headTI}>
            <Image
              src="https://i.postimg.cc/26WyqvG4/logo.png"
              style={styles.imageLogo}
            />
            <View>
              <View style={styles.tableHead}>
                <Text style={styles.textHead}>JOB ORDER</Text>
              </View>

              <View style={styles.tableHeadTwo}>
                <View style={styles.tableInLeft}>
                  <Text>JO. No</Text>
                </View>
                <View style={styles.tableInLeft}>
                  <Text>Data Test 12</Text>
                </View>
              </View>
              <View style={styles.tableHeadTwo}>
                <View style={styles.tableInLeft}>
                  <Text>JO. No</Text>
                </View>
                <View style={styles.tableInLeft}>
                  <Text>Data Test 12</Text>
                </View>
              </View>
              <View style={styles.tableHeadTwo}>
                <View style={styles.tableInLeft}>
                  <Text>JO. No</Text>
                </View>
                <View style={styles.tableInLeft}>
                  <Text>Data Test 12</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.marginTable}>
            <View style={styles.tableUnder}>
              <Text style={styles.textTableHead}>DATA JOB ORDER</Text>
            </View>
            <View style={styles.TableHeadBody}>
              <Text style={styles.tableRow}> Customer</Text>
              <Text>PT. UNI INDO JAYA</Text>
            </View>
            <View style={styles.TableHeadBody}>
              <Text style={styles.tableRow}> Customer</Text>
              <Text>PT. UNI INDO JAYA</Text>
            </View>
          </View>

          <View>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Pariatur, debitis!
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
export default QuotationPdf;

// Shipper PT. BAHARI INDONESIA TERUS
// Consignee PT. UNI INDO JAYA
// Loading JAKARTA, INDONESIA
// Discharge BANJARMASIN, INDONESIA
// ETD 11-09-2023
// ETA 13-09-2023
// No. HBL 012345678
// No. MBL 0987654321
// Vessel TEST
// QTY 1 Carton Box
// Gross Weight 10.00 KGS
// Volume 20 M3
// Commodity TESTONE
