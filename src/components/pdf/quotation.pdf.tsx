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
  textHeadOne: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textUnderheadTI: {
    width: '30%',
  },
  textReCus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tableNew: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  tableCol: {
    width: '100%',
    fontSize: 14,
    fontWeight: 'bold',
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
            <Text style={styles.textHeadOne}>PT. CIPTA KARYA KU INDONE</Text>
            <Text style={styles.textUnderheadTI}>
              Jl.Wijaya XI,No.X AB Kebayoran Baru Jakarta Selatan
            </Text>

            <Text>Attn. Ibu Yuli</Text>
            <Text style={styles.textReCus}>Re. Customer CLEARANCE SEA</Text>

            <Text>We are pleased to quote you the following :</Text>
          </View>

          <View style={styles.tableCol}>
            <View></View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
export default QuotationPdf;
