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
              src="https://i.ibb.co/JmVLcR2/logo.png"
              style={styles.imgLogo}
            />
            <View></View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
export default QuotationPdf;
