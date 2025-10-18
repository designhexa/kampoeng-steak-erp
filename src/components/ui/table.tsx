import React from 'react';
import clsx from 'clsx';

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ children, className = '', ...rest }) => (
  <div className="overflow-x-auto">
    <table className={clsx('min-w-full divide-y divide-border', className)} {...rest}>{children}</table>
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, className = '', ...rest }) => (
  <thead className={className} {...rest}>{children}</thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, className = '', ...rest }) => (
  <tbody className={clsx('bg-transparent', className)} {...rest}>{children}</tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ children, className = '', ...rest }) => (
  <tr className={clsx('border-b last:border-0', className)} {...rest}>{children}</tr>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ children, className = '', ...rest }) => (
  <th className={clsx('text-left px-3 py-2 text-sm font-medium text-muted-foreground', className)} {...rest}>{children}</th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, className = '', ...rest }) => (
  <td className={clsx('px-3 py-2 text-sm', className)} {...rest}>{children}</td>
);
