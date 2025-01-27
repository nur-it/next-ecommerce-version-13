import { createContext, useMemo, useState } from "react";

// create context
export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleCartDrawer = () => setCartDrawerOpen(!cartDrawerOpen);

  const closeCartDrawer = () => {
    setCartDrawerOpen(false);
  };

  const toggleCategoryDrawer = () => setCategoryDrawerOpen(!categoryDrawerOpen);
  const closeCategoryDrawer = () => setCategoryDrawerOpen(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(false);

  const handleChangePage = (p) => {
    setCurrentPage(p);
  };

  const value = useMemo(
    () => ({
      isUpdate,
      setIsUpdate,
      isModalOpen,
      toggleModal,
      closeModal,
      isLoading,
      setIsLoading,
      currentPage,
      setCurrentPage,
      handleChangePage,
      cartDrawerOpen,
      toggleCartDrawer,
      closeCartDrawer,
      setCartDrawerOpen,
      categoryDrawerOpen,
      toggleCategoryDrawer,
      closeCategoryDrawer,
    }),
    [
      isLoading,
      isUpdate,
      isModalOpen,
      currentPage,
      cartDrawerOpen,
      categoryDrawerOpen,
    ]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
