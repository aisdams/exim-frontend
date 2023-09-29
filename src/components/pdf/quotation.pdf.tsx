import {
  Document,
  Text,
  View,
  Page,
  PDFViewer,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

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
    justifyContent: 'space-between',
  },
  imageLogo: {
    width: 230,
    height: 230,
  },
  textTable: {
    textAlign: 'center',
    fontSize: 30,
    letterSpacing: 2,
  },
  textInTable: {
    fontSize: 14,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '22%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
  },
  textNameCom: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  textUnderComp: {
    fontSize: 12,
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
              src="https://i.postimg.cc/cCXVYXkC/logo.png"
              style={styles.imageLogo}
            />

            <View style={styles.table}>
              <Text>QUOTATION</Text>
            </View>
          </View>

          <View>
            <Text>Mobile : 0893</Text>
            <Text>Email : b@yahoo.com</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
export default QuotationPdf;
