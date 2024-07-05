import { notifyError, notifySuccess } from "@utils/toast";
import imageCompression from "browser-image-compression";
import Cookies from "js-cookie";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiXCircle } from "react-icons/fi";

const Uploader = ({ setImageUrl, imageUrl, multiple }) => {
  // default namespace (optional)
  const { t } = useTranslation("ns1");

  // react hook
  const [err, setError] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // get data from cookies
  const cname = Cookies.get("_cname");

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 1000000,
    multiple: multiple ? true : false,
    onDrop: (acceptedFiles) => {
      // without image compress
      setFiles(
        acceptedFiles.map((file) => {
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        })
      );
    },
  });

  useEffect(() => {
    if (fileRejections) {
      fileRejections.map(({ file, errors }) => {
        return (
          <li key={file.path}>
            {file.path} - {file.size} bytes
            <ul>
              {errors.map((e) => (
                <li key={e.code}>{notifyError(e.message)}</li>
              ))}
            </ul>
          </li>
        );
      });
    }

    if (files) {
      files.forEach((file) => {
        const name = file.name.replaceAll(/\s/g, "");
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 300,
          useWebWorker: true,
        };

        imageCompression(file, options)
          .then((compressedFile) => {
            setLoading(true);
            setError("Uploading....");

            fetch(
              `${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_BASE_URL}/${cname}/${name}`,
              {
                method: "PUT",
                headers: {
                  AccessKey: process.env.NEXT_PUBLIC_IMAGE_ACCESS_KEY,
                  "Content-Type": "application/octet-stream",
                },
                // body: file,
                body: compressedFile,
              }
            )
              .then((res) => res.json())
              .then((res) => {
                notifySuccess(res.Message);
                setLoading(false);
                setFiles([]);
                multiple
                  ? setImageUrl((image) => [
                      ...image,
                      `${process.env.NEXT_PUBLIC_IMAGE_DOWNLOAD_BASE_URL}/${cname}/${name}`,
                    ])
                  : setImageUrl(
                      `${process.env.NEXT_PUBLIC_IMAGE_DOWNLOAD_BASE_URL}/${cname}/${name}`
                    );

                // setImageUrl(
                //   `${process.env.NEXT_PUBLIC_IMAGE_DOWNLOAD_BASE_URL}/${cname}/${name}`
                // );
              })
              .catch((err) => {
                console.error("err", err);
                notifyError(err.Message);
                setLoading(false);
                setFiles([]);
              });
          })
          .catch((err) => {
            console.error("err", err);
            notifyError(err.Message);
            setLoading(false);
            setFiles([]);
            // console.log("error when image compressed", err);
          });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const thumbs = files?.map((file) => (
    <div key={file.name}>
      <div>
        <Image
          className="inline-flex border-2 border-gray-100 w-24 max-h-24 object-contain"
          src={file.preview}
          alt={file.name}
          width={100}
          height={100}
        />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const handleRemoveImage = (img) => {
    const baseUrl = `${process.env.NEXT_PUBLIC_IMAGE_DOWNLOAD_BASE_URL}/${cname}/`;
    const length = baseUrl.length;
    const name = img.slice(length, img.length);
    setLoading(true);
    setError("Deleting....");

    fetch(`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_BASE_URL}/${cname}/${name}`, {
      method: "DELETE",
      headers: {
        AccessKey: process.env.NEXT_PUBLIC_IMAGE_ACCESS_KEY,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        notifySuccess(response.Message);
        setLoading(false);
        if (multiple) {
          const result = imageUrl.filter((i) => i !== img);
          setImageUrl(result);
        } else {
          setImageUrl("");
        }
        // setImageUrl("");
      })
      .catch((err) => {
        console.error("err", err);
        notifyError(err.Message);
        setLoading(false);
      });
  };

  return (
    <div className="w-full text-center">
      <div
        className="px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <span className="mx-auto flex justify-center">
          <FiUploadCloud className="text-3xl text-emerald-500" />
        </span>
        <p className="text-sm mt-2">{t("common:dragYourImageHere")}</p>
        <em className="text-xs text-gray-400">
          (Only *.jpeg and *.png images will be accepted)
        </em>
      </div>
      <div className="text-green-500">{loading && err}</div>
      <aside className="flex flex-row flex-wrap mt-4">
        {!multiple && imageUrl ? (
          <div className="relative">
            <Image
              className="inline-flex border rounded-md border-gray-100 w-24 max-h-24 p-2"
              src={imageUrl}
              alt="product"
              width={100}
              height={100}
            />
            <button
              type="button"
              className="absolute -top-2 -right-2 text-red-500 focus:outline-none hover:bg-gray-100"
              onClick={() => handleRemoveImage(imageUrl)}
            >
              <FiXCircle />
            </button>
          </div>
        ) : multiple ? (
          <div className="flex gap-3">
            {imageUrl?.map((image, index) => (
              <div className="relative" key={index + 1}>
                <Image
                  className="inline-flex border rounded-md border-gray-100 w-24 max-h-24 p-2"
                  src={image}
                  alt="product"
                  width={100}
                  height={100}
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 text-red-500 focus:outline-none hover:bg-gray-100"
                  onClick={() => handleRemoveImage(image)}
                >
                  <FiXCircle />
                </button>
              </div>
            ))}
          </div>
        ) : (
          thumbs
        )}
      </aside>
    </div>
  );
};

export default Uploader;
