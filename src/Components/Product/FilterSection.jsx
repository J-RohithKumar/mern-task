import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FunnelIcon, MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import ProductCard from "./ProductCard";
import getCategories from "./getCategories";
import getData from "./getData";
import getAll from "./getAll";
let selectedCategory = "";
let offset = 0;
let hasMore=true
import { useLocation, useNavigate } from "react-router-dom";

export default function FilterSection() {
  const [filters, setFilters] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    if (loading || !hasMore) {
      console.log("Done Fetching. No more products to fetch")
      return;
    }
    setLoading(true);

    try {
      let response;
      if (selectedCategory) {
        response = await getData("/category/" + selectedCategory, offset);
      } else {
        response = await getData("", offset);
      }
      const newData = response;
      if (newData.length === 0) {
        console.log("done");
        hasMore=false;
      } else {
        setData((prevData) => [...prevData, ...newData]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= fullHeight - 100 && !loading) {
        offset += 10;
        fetchData();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  const GetCategories = async () => {
    let response = await getCategories();
    setFilters([
      {
        id: "category",
        name: "Category",
        options: response,
      },
    ]);
  };

  useEffect(() => {
    GetCategories();
    fetchData();
    offset += 10;
  }, []);

  const handleFilter = async (sectionId, value) => {
    const searchParam = new URLSearchParams(location.search);
    searchParam.set(sectionId, value);
    const query = searchParam.toString();
    navigate({ search: `${query}` });
    offset = 0;
    setData([]);
    hasMore=true;
    selectedCategory = value;
    fetchData();
  };

  const inputSearch = async () => {
    offset = 0;
    let response
    if (selectedCategory) {
      response = await getAll("/category/" + selectedCategory)
    } else {
      response = await getAll("");
    }
    console.log(response)
    let searchItem = document.getElementById("inputElement");
    let results = response.filter((item) => {
      return item.brand.toLowerCase().includes(searchItem.value);
    });
    setData([...results]);
  };

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="h-5 w-5 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="h-5 w-5 [.group:not([data-open])_&]:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              defaultValue={option.value}
                              defaultChecked={option.checked}
                              id={`filter-mobile-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="radio"
                              onChange={() => handleFilter(option.value)}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="ml-3 min-w-0 flex-1 text-gray-500"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              New Arrivals
            </h1>

            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-b border-gray-200 py-6"
                  >
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="h-5 w-5 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="h-5 w-5 [.group:not([data-open])_&]:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              defaultValue={option.value}
                              defaultChecked={option.checked}
                              id={`filter-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="radio"
                              onChange={() =>
                                handleFilter(section.id, option.value)
                              }
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`filter-${section.id}-${optionIdx}`}
                              className="ml-3 text-sm text-gray-600"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                <div className="flex ">
                  <input
                    id="inputElement"
                    type="search"
                    className="w-full h-[40px] border-2 p-2"
                    placeholder="Search Item"
                  />
                  <button className="p-1 mx-1 border" onClick={inputSearch}>
                    Search
                  </button>
                </div>
                <div className="flex flex-wrap justify-start ">
                  {data.map((x) => (
                    // eslint-disable-next-line react/jsx-key
                    <ProductCard product={x} key={x.id} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
