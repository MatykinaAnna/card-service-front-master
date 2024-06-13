import '../../App.scss';
import React from 'react';
import { ServicesList } from 'widgets/ServicesList';
import { ServiceCard } from 'widgets/ServiceCard';
import { ModalWindowImage } from 'entities/ModalWindowImage/ui/ModalWindowImage';
import { ConfirmWindow } from 'features/ConfirmWindow';
import CardViewWindow from 'entities/CardViewWindow';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Loader } from 'features/Loader';

const PagesApp = () => {
  const openModalWindowImage = useAppSelector(
    (state) => state.cardReducer.openModalWindowImage
  );
  const openConfirmReducer = useAppSelector(
    (state) => state.confirmReducer.openConfirmReducer
  );
  const openСardViewReducer = useAppSelector(
    (state) => state.cardViewReducer.openСardViewReducer
  );
  const loadServicesFulfilled = useAppSelector(
    (state) => state.serviceReducer.loadServicesFulfilled
  );

  return (
    <div className="App">
      {!loadServicesFulfilled && <Loader />}
      {<ServicesList />}
      {<ServiceCard />}
      {openModalWindowImage && <ModalWindowImage />}
      {/* {openConfirmReducer && <ConfirmWindow />} */}
      {openСardViewReducer && <CardViewWindow />}
    </div>
  );
};

export default PagesApp;
