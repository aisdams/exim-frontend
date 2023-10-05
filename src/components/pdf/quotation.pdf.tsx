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
  family: 'DustismoRoman',
  fonts: [
    { src: '/fonts/DustismoRoman.ttf' },
    { src: '/fonts/DustismoRomanBold.ttf', fontWeight: 'bold' },
  ],
});
const styles = StyleSheet.create({
  page: {
    width: '100%',
    fontFamily: 'DustismoRoman',
    fontSize: '12px',
    display: 'none',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 69,
  },
  headTI: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imgLogo: {
    width: 220,
    height: 80,
  },
  tableOne: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableRowO: {
    border: '1px solid #000',
  },
  textRowO: {
    fontSize: 12,
    alignItems: 'center',
    fontWeight: 'bold',
    letterSpacing: 4,
    paddingHorizontal: 25,
    borderBottom: '1px solid #000',
  },
  tableL: {
    paddingLeft: 20,
    paddingRight: 5,
    borderBottom: '1px solid sama',
    borderRight: '1px solid #00',
  },
  tableR: {
    paddingLeft: 12,
    paddingRight: 20,
    borderBottom: '1px solid sama',
  },
  topMargin: {
    marginTop: 40,
  },
  textHead: {
    fontSize: 9,
    fontWeight: 'extrabold',
  },
  textHeadTwo: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: 'bold',
    width: '13%',
  },
  textHeadThree: {
    marginVertical: 15,
    fontSize: 9,
    fontWeight: 'bold',
    width: '13%',
  },
  textHeadFour: {
    marginTop: 10,
    fontSize: 9,
    fontWeight: 'bold',
  },
  textParagrapf: {
    fontSize: 12,
    fontWeight: 'light',
  },
  table: {
    border: '1px solid #000',
  },
  tableRow: {
    borderLeft: '1px solid #000',
  },
  secApprov: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 9,
    fontWeight: 'extrabold',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  tableUnder: {
    border: '1px solid #000',
    marginTop: '20',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableUnderTwo: {
    borderLeft: '1px solid @000',
    paddingLeft: 20,
  },
  tableUTwo: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  textTableUnder: {
    marginTop: '20',
    fontSize: 9,
    fontWeight: 'extrabold',
  },
  textFinally: {
    marginTop: 80,
    fontSize: 9,
  },
  textS: {
    fontSize: 9,
  },
  viewHr: {
    backgroundColor: '#000',
    width: 40,
    height: 'auto',
  },
});

type QuotationPdfProps = {
  // rows: RequestItemDetailWithItem[];
};

const QuotationPdf: React.FC<QuotationPdfProps> = () => {
  return (
    <PDFViewer className="h-screen w-full" style={styles.textParagrapf}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.headTI}>
            <Image
              src="https://i.ibb.co/JmVLcR2/logo.png"
              style={styles.imgLogo}
            />
            <View style={styles.tableRowO}>
              <View>
                <Text style={styles.textRowO}>QUOTATION</Text>
                <View style={styles.tableOne}>
                  <Text style={styles.tableL}>Quo No</Text>
                  <Text style={styles.tableR}>20230001</Text>
                </View>
                <View style={styles.tableOne}>
                  <Text style={styles.tableL}>Date</Text>
                  <Text style={styles.tableR}>2023-09-01</Text>
                </View>
                <View style={styles.tableOne}>
                  <Text style={styles.tableL}>Kurs</Text>
                  <Text style={styles.tableR}>30</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.topMargin}>
            <View>
              <Text style={styles.textHead}>PT. CIPTA KARYA KU INDONESIA</Text>
              <Text style={styles.textHeadTwo}>
                Jl.Wijaya XI,No.X AB Kebayoran Baru Jakarta Selatan
              </Text>
            </View>

            <View>
              <Text style={styles.textHeadThree}>Attn. Ibu. Yuli</Text>
              <Text style={styles.textHead}>Re. CUSTOMS CLEARANCE SEA</Text>
              <Text style={styles.textHeadFour}>
                We are pleased to quote you the following :
              </Text>
            </View>

            <View style={styles.tableUnder}>
              <Text style={styles.tableUnderTwo}>NO</Text>
              <Text style={styles.tableUnderTwo}>ITEMS</Text>
              <Text style={styles.tableUnderTwo}>QTY</Text>
              <Text style={styles.tableUnderTwo}>UNIT</Text>
              <View style={styles.tableUnderTwo}>
                Pricee
                <Text>Price</Text>
                <View style={styles.tableUTwo}>
                  <Text>IDR</Text>
                  <Text>USD</Text>
                </View>
              </View>
              <Text style={styles.tableUnderTwo}>AMOUNT</Text>
              <Text style={styles.tableUnderTwo}>REMARKS</Text>
            </View>

            <Text style={styles.textTableUnder}>
              Will be happy to supply and any further information you may need
              and trust that you call on us to fill your order which will
              receive our prompt and careful attention.
            </Text>

            <View style={styles.secApprov}>
              <Text>Yours Faithfully</Text>
              <View>
                <Text>Approved By,</Text>
                <Text>PT. CIPTA KARYA KU INDONESIA</Text>
              </View>
            </View>

            <View style={styles.textFinally}>
              <Text style={styles.textS}>SALES 2</Text>
              <View style={styles.viewHr} />
              <Text>Mobile : 0893</Text>
              <Text>Email : b@yahoo.com</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
export default QuotationPdf;
