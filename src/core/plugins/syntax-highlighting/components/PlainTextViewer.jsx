/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

const PlainTextViewer = ({ className = "", tabIndex, children }) => (
  <pre className={classNames("microlight", className)} tabIndex={tabIndex}>
    {children}
  </pre>
)

PlainTextViewer.propTypes = {
  className: PropTypes.string,
  tabIndex: PropTypes.number,
  children: PropTypes.string.isRequired,
}

export default PlainTextViewer
