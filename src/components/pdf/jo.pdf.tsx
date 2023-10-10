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
import * as JOService from '@/apis/jo.api';
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
  table: {
    border: '1px solid #000',
    marginTop: '20',
  },
  tableHData: {
    backgroundColor: '#cce4ff',
    fontSize: 10,
    paddingHorizontal: 12,
    paddingVertical: 3,
    letterSpacing: 1,
    borderBottom: '1px solid #000',
  },
  tableFData: {
    display: 'flex',
    flexDirection: 'row',
  },
  tableCData: {
    fontSize: 10,
    paddingHorizontal: 12,
    paddingVertical: 1,
    letterSpacing: 1,
    borderBottom: '1px solid #000',
    borderRight: '1px solid #000',
  },
  tableDData: {
    fontSize: 10,
    paddingHorizontal: 12,
    paddingVertical: 1,
    letterSpacing: 1,
    borderBottom: '1px solid #000',
  },
});

type JOPdfProps = {
  jo_no: string;
};

const JOPdf: React.FC<JOPdfProps> = ({ jo_no }) => {
  //! get jo
  const joQuery = useQuery({
    queryKey: ['jo', jo_no],
    queryFn: () => JOService.getById(jo_no),
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  return joQuery.isLoading ? (
    <div className="grid place-items-center">
      <Loader />
    </div>
  ) : joQuery.isError ? (
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
                    <Text style={styles.tableColumn}>JO No</Text>
                    <Text style={styles.tableColumn}>Date</Text>
                    <Text style={styles.tableColumn}>Type</Text>
                    <Text style={styles.tableColumn}>Marketing</Text>
                  </View>
                  <View>
                    <Text style={styles.tableColumnTwo}>
                      {joQuery.data.data.jo_no}
                    </Text>
                    <Text style={styles.tableColumnTwo}>customer_code</Text>
                    <Text style={styles.tableColumnTwo}>
                      {joQuery.data.data.quo_no}
                    </Text>
                    <Text style={styles.tableColumn}>
                      DOMESTIK
                      <Text>{joQuery.data.data.quo_no}</Text>
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHData}>
              <Text>DATA JOB ORDER</Text>
            </View>
            <View style={styles.tableFData}>
              <View style={{ fontSize: 10 }}>
                <Text style={styles.tableCData}>Customer</Text>
                <Text style={styles.tableCData}>Shipper</Text>
                <Text style={styles.tableCData}>Consignee</Text>
                <Text style={styles.tableCData}>Loading</Text>
                <Text style={styles.tableCData}>Discharge</Text>
                <Text style={styles.tableCData}>ETD</Text>
                <Text style={styles.tableCData}>ETA</Text>
                <Text style={styles.tableCData}>No. HBL</Text>
                <Text style={styles.tableCData}>No. MBL</Text>
                <Text style={styles.tableCData}>Vessel</Text>
                <Text style={styles.tableCData}>QTY</Text>
                <Text style={styles.tableCData}>Gross Weight </Text>
                <Text style={styles.tableCData}>Volume</Text>
              </View>

              <View style={{ fontSize: 10, width: '100%' }}>
                <Text style={styles.tableDData}>JO-00001</Text>
                <Text style={styles.tableDData}>Test</Text>
                <Text style={styles.tableDData}>TestTwo</Text>
                <Text style={styles.tableDData}>TestTwo</Text>
                <Text style={styles.tableDData}>TestTwo</Text>
                <Text style={styles.tableDData}>test</Text>
                <Text style={styles.tableDData}>test</Text>
                <Text style={styles.tableDData}>test</Text>
                <Text style={styles.tableDData}>test</Text>
                <Text style={styles.tableDData}>test</Text>
                <Text style={styles.tableDData}>test</Text>
                <Text style={styles.tableDData}>test</Text>
                <Text style={styles.tableDData}>test</Text>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                height: 160,
                padding: 20,
              }}
            >
              <Text style={{ fontSize: 8 }}>NOTE :</Text>
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
                ({joQuery.data.data.createdBy})
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