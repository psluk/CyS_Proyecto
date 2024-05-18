import {convertApiDateTimeToLocalString } from "../../../../common/format/DateFormatters"; 
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Message({ message, self }) {
  return (
    <>
      <li
        className={classNames(
          self.customClaims.userId !== message.userId ? "justify-start" : "justify-end",
          "flex",
        )}
      >
        <div>
          <div
            className={classNames(
              self.customClaims.userId  !== message.userId
                ? "border border-gray-200 bg-white text-gray-700 shadow-md "
                : "bg-blue-600 text-white dark:bg-blue-500",
              "relative max-w-xl rounded-lg px-4 py-2 shadow",
            )}
          >
            <span className="block font-normal ">{message.messageBody}</span>
          </div>
          <span className="block text-sm text-gray-700 dark:text-gray-400">
            {convertApiDateTimeToLocalString(message.timestamp)}
          </span>
        </div>
      </li>
    </>
  );
}
