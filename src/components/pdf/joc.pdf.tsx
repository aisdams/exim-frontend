import { JobOrder } from '@/types';
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
import { toast } from 'react-toastify';
import { IS_DEV } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import * as JOCService from '@/apis/joc.api';
import { getErrMessage } from '@/lib/utils';
import Loader from '@/components/table/loader';

import React, { useState } from 'react';

Font.register({
  family: 'fabersans.ttf',
  fonts: [{ src: '/fonts/fabersans.ttf' }],
});
const styles = StyleSheet.create({
  page: {
    width: '100%',
    fontFamily: 'fabersans.ttf',
    fontSize: 12,

    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 69,
  },
  headTI: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imgLogo: {
    width: 220,
    height: 80,
  },
  // IN HEREEE
  tableRow0: {
    borderLeft: '1px solid #000',
    borderRight: '1px solid #000',
    borderTop: '1px solid #000',
  },
  tablePad: {
    borderBottom: '1px solid #000',
  },
  textPad: {
    paddingVertical: 3,
    marginHorizontal: 'auto',
    textAlign: 'center',
    alignItems: 'center',
  },
  tableUnderPad: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 'auto',
    justifyContent: 'center',
    textAlign: 'center',
  },
  tableL: {
    borderRight: '1px solid #000',
  },
  tableColumn: {
    borderBottom: '1px solid #000',
    paddingHorizontal: 12,
    fontSize: 10,
  },
  tableColumnTwo: {
    borderBottom: '1px solid #000',
    paddingHorizontal: 12,
    fontSize: 10,
  },
  textParagrapf: {
    fontSize: 12,
    fontWeight: 'normal',
  },
});

type JOCPdfProps = {
  joc_no: string;
};

const JOPdf: React.FC<JOCPdfProps> = ({ joc_no }) => {
  //! get jo
  const jocQuery = useQuery({
    queryKey: ['jo', joc_no],
    queryFn: () => JOCService.getById(joc_no),
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  return jocQuery.isLoading ? (
    <div className="grid place-items-center">
      <Loader />
    </div>
  ) : jocQuery.isError ? (
    <p className="text-center text-destructive">Something went wrong...</p>
  ) : (
    <PDFViewer className="h-screen w-full" style={styles.textParagrapf}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.headTI}>
            <Image
              src="https://i.ibb.co/JmVLcR2/logo.png"
              style={styles.imgLogo}
            />
            <View style={styles.tableRow0}>
              <View>
                <View style={styles.tablePad}>
                  <Text style={styles.textPad}>JOB ORDERS</Text>
                </View>
                <View style={styles.tableUnderPad}>
                  <View style={styles.tableL}>
                    <Text style={styles.tableColumn}>JOC No</Text>
                    <Text style={styles.tableColumn}>Date</Text>
                    <Text style={styles.tableColumn}>Type</Text>
                  </View>
                  <View>
                    <Text style={styles.tableColumnTwo}>
                      {jocQuery.data.data.joc_no}
                    </Text>
                    <Text style={styles.tableColumnTwo}>customer_code</Text>
                    <Text style={styles.tableColumnTwo}>
                      {jocQuery.data.data.quo_no}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View>
            <View>
              <Text>Agent :</Text>
              <Text>Loading :</Text>
              <Text>Discharge :</Text>
              <Text>ETD :</Text>
              <Text>ETA :</Text>
            </View>
            <View>
              <Text>No. HBL :</Text>
              <Text>No. MBL :</Text>
              <Text>Vessel :</Text>
              <Text>No. Containe :</Text>
            </View>
          </View>

          <View>
            <Text>DATA JO</Text>

            <View>
              <View>
                <Text>No.</Text>
                <Text>No JO.</Text>
                <Text>Customer</Text>
                <Text>No. BL</Text>
                <Text>Discharge</Text>
                <Text>Gw</Text>
                <Text>Meas</Text>
              </View>
              <View>
                <Text>No.</Text>
                <Text>No JO.</Text>
                <Text>Customer</Text>
                <Text>No. BL</Text>
                <Text>Discharge</Text>
                <Text>Gw</Text>
                <Text>Meas</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '80%',
              marginTop: 40,
              fontSize: 11,
            }}
          >
            <View>
              <Text>Created</Text>
              <Text style={{ fontSize: 10, marginTop: 80 }}>
                {/* ({joQuery.data.data.createdBy}) */}
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 'auto',
              }}
            >
              <Text>Approved</Text>
              <Text style={{ fontSize: 10, marginTop: 80 }}>
                (...........................................)
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
export default JOPdf;
